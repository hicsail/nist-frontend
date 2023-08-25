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
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import AddCommentIcon from '@mui/icons-material/AddComment';
import CommentIcon from '@mui/icons-material/Comment';
import SendIcon from '@mui/icons-material/Send';
import ReplyIcon from '@mui/icons-material/Reply';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteIcon from '@mui/icons-material/Delete';
import { OrganizationContext } from '../contexts/organization.context';
import { DeleteFileDocument, useAddFileMutation, useGetFileQuery } from '../graphql/file/file';
import { useAddCommentMutation, useAddReplyMutation, useDeleteCommentMutation, useGetCommentsQuery } from '../graphql/comment/comment';
import { ApolloClient } from '@apollo/client';

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
  client: ApolloClient<any>;
  name: string;
  description: string;
  icon: ReactNode;
  fileExtensions: string[];
  subscriptions: { objectUploaded?: ((data: any) => void) | undefined; objectUpdated?: ((data: any) => void) | undefined; objectDeleted?: ((data: any) => void) | undefined };

  constructor(client: ApolloClient<any>) {
    this.client = client;
    this.name = 'Comment';
    this.description = 'Comment on documents';
    this.icon = <CommentIcon />;
    this.fileExtensions = ['*']; // wildcard. support all files
    this.subscriptions = {
      objectDeleted: (data: any) => this.deleteFileRecord(data.objectDeleted)
    };
  }

  getView(object: S3Object): ReactNode {
    return <FileCommentPanel object={object} />;
  }

  async deleteFileRecord(object: S3Object): Promise<void> {
    await this.client.mutate({
      mutation: DeleteFileDocument,
      variables: {
        id: object.id
      }
    });
  }
}

interface CommentPanelProps {
  object: S3Object | undefined;
  comment: Comment;
  expand: boolean;
  onDelete: (id: string) => void;
}

interface MoreHorizMenuProps {
  id: string;
  onDelete: (id: string) => void;
}

const MoreHorizMenu: FC<MoreHorizMenuProps> = (props) => {
  const { id, onDelete: handleDeleteCommentReply } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClickMore = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMore = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton size="small" onClick={handleClickMore}>
        <MoreHorizIcon fontSize="small" sx={{ margin: 0 }} />
      </IconButton>{' '}
      <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMore} elevation={2}>
        <MenuItem
          onClick={() => {
            handleDeleteCommentReply(id);
            setAnchorEl(null);
          }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

const ReplyPanel: FC<CommentPanelProps> = (props) => {
  const { object, comment, expand, onDelete: handleDeleteCommentReply } = props;

  const commentQuery = useGetCommentsQuery({
    variables: {
      fileId: object?.id!
    }
  });
  const [addReplyMutation] = useAddReplyMutation();

  const [expandReply, setExpandReply] = useState<boolean>(false);
  const [replyTo, setReplyTo] = useState<User | null>(null);
  const [replyContents, setReplyContents] = useState<string>('');

  const handleExpandReply = (replyTo: User | null) => {
    setReplyTo(replyTo);
    setExpandReply(true);
  };

  const handleCollapseReply = () => {
    setReplyTo(null);
    setExpandReply(false);
  };

  const handleReplyInput = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setReplyContents(event.target.value);
  };

  const handleReply = async (_user: User | null, content: string, commentId: string) => {
    // TODO: may need to fix comment schema to include replyTo field
    // api call to post comment
    if (!content) return;
    await addReplyMutation({
      variables: {
        fileId: object?.id!,
        parentId: commentId,
        content
      }
    });

    commentQuery.refetch();

    setReplyTo(null);
    setReplyContents('');
    setExpandReply(false);
  };

  useEffect(() => {
    if (!expand) setExpandReply(expand);
  }, [expand]);

  return (
    <>
      <Collapse in={expand} timeout="auto" unmountOnExit>
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
                      <Avatar>{(reply.user.fullname || reply.user.username || reply.user.email)[0]}</Avatar>
                    </Box>
                    <Box>
                      <Typography variant="body2">{reply.user.fullname || reply.user.username || reply.user.email}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(new Date(reply.date))}
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="body2">{reply.content}</Typography>
                  </Box>
                  <Box textAlign="end">
                    <IconButton size="small" onClick={() => handleExpandReply(reply.user)}>
                      <ReplyIcon fontSize="small" sx={{ margin: 0 }} />
                    </IconButton>
                    <MoreHorizMenu id={reply._id} onDelete={handleDeleteCommentReply} />
                  </Box>
                </Stack>
              ))}
            </Box>
          </Box>
        </CardContent>
      </Collapse>
      <Collapse in={expandReply} timeout="auto" unmountOnExit>
        <ClickAwayListener onClickAway={handleCollapseReply}>
          <CardContent sx={{ paddingY: '8px' }}>
            <TextField
              placeholder={replyTo ? `Reply to ${replyTo.fullname || replyTo.username || replyTo.email}:` : ''}
              variant="standard"
              sx={{ width: 'calc(100% - 40px)' }}
              value={replyContents}
              onChange={handleReplyInput}
              multiline
            />
            <IconButton onClick={() => handleReply(replyTo, replyContents, comment._id)}>
              <SendIcon />
            </IconButton>
          </CardContent>
        </ClickAwayListener>
      </Collapse>
    </>
  );
};

const FileCommentPanel: FC<{ object: S3Object | undefined }> = ({ object }) => {
  const { organization } = useContext(OrganizationContext);

  const fileQuery = useGetFileQuery({
    variables: {
      id: object?.id!
    }
  });
  const [addFileMutation] = useAddFileMutation();
  const commentQuery = useGetCommentsQuery({
    variables: {
      fileId: object?.id!
    }
  });
  const [addCommentMutation] = useAddCommentMutation();
  const [addReplyMutation] = useAddReplyMutation();
  const [deleteCommentMutation] = useDeleteCommentMutation();

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
  const [replyContents, setReplyContents] = useState<{ [key: number]: string }>({});
  const [newComment, setNewComment] = useState<string>('');

  const handleExpandThread = (index: number) => {
    setExpandThread((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleResetExpandThread = () => {
    setExpandThread(initExpandThreadState);
  };

  const handleExpandReply = (index: number) => {
    const newState = comments.reduce((acc, _, index) => {
      acc[index] = false;
      return acc;
    }, {} as { [key: number]: boolean });

    newState[index] = true;

    setExpandReply(newState);
  };

  const handleCollapseReply = (index: number) => {
    setExpandReply((prev) => ({ ...prev, [index]: false }));
  };

  const handleComment = async (content: string) => {
    // api call to post comment
    if (!content) return;
    await addCommentMutation({
      variables: {
        fileId: object?.id!,
        content
      }
    });

    commentQuery.refetch();
    setNewComment('');
  };

  const handleReply = async (content: string, index: number, commentId: string) => {
    // TODO: may need to fix comment schema to include replyTo field
    // api call to post comment
    if (!content) return;
    await addReplyMutation({
      variables: {
        fileId: object?.id!,
        parentId: commentId,
        content
      }
    });

    commentQuery.refetch();

    setReplyContents((prev) => ({ ...prev, [index]: '' }));
    setExpandReply((prev) => ({ ...prev, [index]: false }));
  };

  const handleReplyInput = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, index: number) => {
    setReplyContents((prev) => ({ ...prev, [index]: event.target.value }));
  };

  const handleCommentInput = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setNewComment(event.target.value);
  };

  const handleDeleteCommentReply = async (id: string) => {
    await deleteCommentMutation({
      variables: {
        id
      }
    });
    commentQuery.refetch();
    handleResetExpandThread();
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

    if (object) initFile(object);
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
                  <IconButton onClick={() => handleExpandReply(index)}>
                    <AddCommentIcon />
                  </IconButton>
                  <IconButton disabled={!Boolean(comment.replies) || comment.replies?.length === 0} onClick={() => handleExpandThread(index)}>
                    <Badge badgeContent={comment.replies!.length} color="primary">
                      <CommentIcon />
                    </Badge>
                  </IconButton>
                  <MoreHorizMenu id={comment._id} onDelete={handleDeleteCommentReply} />
                </Box>
              </CardActions>
              <ReplyPanel object={object} comment={comment} expand={expandThread[index]} onDelete={handleDeleteCommentReply} />
              <Collapse in={expandReply[index]} timeout="auto" unmountOnExit>
                <ClickAwayListener onClickAway={() => handleCollapseReply(index)}>
                  <CardContent sx={{ paddingY: '8px' }}>
                    <TextField variant="standard" sx={{ width: 'calc(100% - 40px)' }} value={replyContents[index]} onChange={(event) => handleReplyInput(event, index)} multiline />
                    <IconButton onClick={() => handleReply(replyContents[index], index, comment._id)}>
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
          position: 'absolute',
          width: '100%',
          bottom: 0,
          padding: '10px',
          zIndex: 1,
          borderTop: 1,
          borderColor: 'rgba(0, 0, 0, 0.12)'
        }}
      >
        <TextField sx={{ width: 'calc(100% - 40px)' }} value={newComment} size="small" onChange={handleCommentInput} multiline />
        <IconButton onClick={() => handleComment(newComment)}>
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
