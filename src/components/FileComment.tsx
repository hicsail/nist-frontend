import { ChangeEvent, FC, ReactNode, useContext, useEffect, useState } from 'react';
import { S3Object, SideNavPlugin } from '@bu-sail/s3-viewer';
import {
  Avatar,
  Badge,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  ClickAwayListener,
  Collapse,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import AddCommentIcon from '@mui/icons-material/AddComment';
import CommentIcon from '@mui/icons-material/Comment';
import SendIcon from '@mui/icons-material/Send';
import ReplyIcon from '@mui/icons-material/Reply';
import { OrganizationContext } from '../contexts/organization.context';
import { useAddFileMutation, useGetFileQuery } from '../graphql/file/file';
import { useAddCommentMutation, useAddReplyMutation, useGetCommentsQuery } from '../graphql/comment/comment';

export type Comment = {
  __typename?: 'Comment';
  _id: string;
  user: User;
  file: any;
  date: string;
  content: string;
  replies?: Comment[];
};

export type User = {
  id: string;
  username: string;
  fullname: string;
  email: string;
};

export class FileCommentPlugin implements SideNavPlugin {
  name: string;
  description: string;
  icon: ReactNode;
  fileExtensions: string[];
  subscriptions: { objectUploaded?: ((data: any) => void) | undefined; objectUpdated?: ((data: any) => void) | undefined; objectDeleted?: ((data: any) => void) | undefined };

  constructor() {
    this.name = 'Comment';
    this.description = 'Comment on documents';
    this.icon = <CommentIcon />;
    this.fileExtensions = ['*']; // wildcard. support all files
    this.subscriptions = {};
  }

  getView(object: S3Object): ReactNode {
    return <FileCommentPanel object={object} />;
  }
}

const FileCommentPanel: FC<{ object: S3Object | undefined }> = ({ object }) => {
  const { organization } = useContext(OrganizationContext);

  const fileQuery = useGetFileQuery({
    variables: {
      id: object!.id!
    }
  });
  const [addFileMutation] = useAddFileMutation();
  const commentQuery = useGetCommentsQuery({
    variables: {
      fileId: object!.id!
    }
  });
  const [addCommentMutation] = useAddCommentMutation();
  const [addReplyMutation] = useAddReplyMutation();

  const [comments, setComments] = useState<any[]>([]);
  const initExpandThreadState = comments.reduce((acc, _, index) => {
    acc[index] = false;
    return acc;
  }, {} as { [key: number]: boolean });
  const initExpandReplyState = comments.reduce((acc, _, index) => {
    acc[index] = false;
    return acc;
  }, {} as { [key: number]: boolean });

  const [expandThread, setExpandThread] = useState<{ [key: number]: boolean }>(initExpandThreadState);
  const [expandReply, setExpandReply] = useState<{ [key: number]: boolean }>(initExpandReplyState);
  const [replyTo, setReplyTo] = useState<User | null>(null);
  const [replyContents, setReplyContents] = useState<{ [key: number]: string }>({});
  const [newComment, setNewComment] = useState<string>('');

  const handleExpandThread = (index: number) => {
    setExpandThread((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleExpandReply = (replyTo: User | null, index: number) => {
    const newState = comments.reduce((acc, _, index) => {
      acc[index] = false;
      return acc;
    }, {} as { [key: number]: boolean });

    newState[index] = true;

    setReplyTo(replyTo);
    setExpandReply(newState);
  };

  const handleCollapseReply = (index: number) => {
    setReplyTo(null);
    setExpandReply((prev) => ({ ...prev, [index]: false }));
  };

  const handleComment = async (content: string) => {
    // api call to post comment
    await addCommentMutation({
      variables: {
        fileId: object!.id!,
        content
      }
    });

    commentQuery.refetch();
    setNewComment('');
  };

  const handleReply = async (_user: User | null, content: string, index: number, commentId: string) => {
    // TODO: may need to fix comment schema to include replyTo field
    // api call to post comment
    await addReplyMutation({
      variables: {
        fileId: object!.id!,
        parentId: commentId,
        content
      }
    });

    commentQuery.refetch();

    setReplyTo(null);
    setReplyContents((prev) => ({ ...prev, [index]: '' }));
    setExpandReply((prev) => ({ ...prev, [index]: false }));
  };

  const handleReplyInput = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, index: number) => {
    setReplyContents((prev) => ({ ...prev, [index]: event.target.value }));
  };

  const handleCommentInput = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setNewComment(event.target.value);
  };

  useEffect(() => {
    const initFile = async (object: S3Object) => {
      // check if file exists in db
      if (!fileQuery.data?.getFileByFileId) {
        await addFileMutation({
          variables: {
            id: object.id!,
            bucket: organization!.bucket
          }
        });
      }
    };

    initFile(object!);
  }, []);

  useEffect(() => {
    if (commentQuery.data) {
      setComments(commentQuery.data?.getFileByFileId?.comments || []);
    }
  }, [object, commentQuery.data, commentQuery.error]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 60px)', backgroundColor: '#f5f5f5' }}>
      <Grid sx={{ padding: '8px', overflowY: 'auto', margin: 0 }}>
        {comments.map((comment, index) => (
          <Grid key={comment._id} item marginBottom="8px">
            <Card>
              <CardHeader
                avatar={<Avatar>{(comment.user.fullname || comment.user.username || comment.user.email)[0]}</Avatar>}
                title={comment.user.fullname || comment.user.username || comment.user.email}
                subheader={formatDate(new Date(comment.date))}
                sx={{ paddingBottom: '8px' }}
              />
              <CardContent sx={{ paddingY: '8px' }}>
                <Typography variant="body2">{comment.content}</Typography>
              </CardContent>
              <CardActions disableSpacing>
                <Box marginLeft="auto">
                  <IconButton onClick={() => handleExpandReply(null, index)}>
                    <AddCommentIcon />
                  </IconButton>
                  <IconButton disabled={!Boolean(comment.replies) || comment.replies?.length === 0} onClick={() => handleExpandThread(index)}>
                    <Badge badgeContent={comment.replies!.length} color="primary">
                      <CommentIcon />
                    </Badge>
                  </IconButton>
                </Box>
              </CardActions>
              <Collapse in={expandThread[index]} timeout="auto" unmountOnExit>
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%'
                    }}
                  >
                    <Divider orientation="vertical" variant="middle" flexItem sx={{ border: 1, borderColor: '#E0E0E0', marginRight: '16px' }} />
                    <Box width="100%">
                      {comment.replies?.map((reply: any, replyIndex: number) => (
                        <Stack key={reply._id} spacing="8px">
                          {replyIndex !== 0 && <Divider sx={{ paddingTop: '8px' }} />}
                          <Box display="flex">
                            <Box marginRight="16px">
                              <Avatar>{(comment.user.fullname || comment.user.username || comment.user.email)[0]}</Avatar>
                            </Box>
                            <Box>
                              <Typography variant="body2">{comment.user.fullname || comment.user.username || comment.user.email}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {formatDate(new Date(reply.date))}
                              </Typography>
                            </Box>
                          </Box>
                          <Box>
                            <Typography variant="body2">{reply.content}</Typography>
                          </Box>
                          <Box textAlign="end">
                            <IconButton size="small" onClick={() => handleExpandReply(reply.user, index)}>
                              <ReplyIcon fontSize="small" sx={{ margin: 0 }} />
                            </IconButton>
                          </Box>
                        </Stack>
                      ))}
                    </Box>
                  </Box>
                </CardContent>
              </Collapse>
              <Collapse in={expandReply[index]} timeout="auto" unmountOnExit>
                <ClickAwayListener onClickAway={() => handleCollapseReply(index)}>
                  <CardContent sx={{ paddingY: '8px' }}>
                    <TextField
                      placeholder={replyTo ? `Reply to ${replyTo.fullname || replyTo.username || replyTo.email}:` : ''}
                      variant="standard"
                      sx={{ width: 'calc(100% - 40px)' }}
                      value={replyContents[index]}
                      onChange={(event) => handleReplyInput(event, index)}
                      multiline
                    />
                    <IconButton onClick={() => handleReply(replyTo, replyContents[index], index, comment._id)}>
                      <SendIcon />
                    </IconButton>
                  </CardContent>
                </ClickAwayListener>
              </Collapse>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box
        sx={{
          display: 'flex',
          position: 'absolute',
          width: '100%',
          bottom: 0,
          padding: '10px',
          zIndex: 1,
          borderTop: 1,
          borderColor: 'rgba(0, 0, 0, 0.12)',
          backgroundColor: 'white'
        }}
      >
        <TextField sx={{ width: 'calc(100% - 40px)' }} value={newComment} size="small" onChange={handleCommentInput} multiline />
        <IconButton onClick={() => handleComment(newComment)} sx={{ alignItems: 'center' }}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

function formatDate(date: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

  const zeroPad = (num: number, places: number = 2) => String(num).padStart(places, '0');

  const monthName = months[date.getMonth()];
  const day = zeroPad(date.getDate());
  const year = date.getFullYear();

  const hours = zeroPad(date.getHours());
  const minutes = zeroPad(date.getMinutes());
  const seconds = zeroPad(date.getSeconds());

  return `${monthName} ${day}, ${year} ${hours}:${minutes}:${seconds}`;
}
