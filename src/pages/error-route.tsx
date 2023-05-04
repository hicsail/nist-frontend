import { Typography } from '@mui/material';
import { useRouteError } from 'react-router-dom';

export default function ErrorPage() {
    const error: any = useRouteError();
    console.error(error);

    return (
        <div id="error-page">
            <Typography variant='h1'>Oops!</Typography>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
        </div>
    );
}
