import { app } from "./app";

app.listen({
    host: '0.0.0.0',
    port: 3030,
}).then(() => {
    console.log('listening on port 3030!');
});