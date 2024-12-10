import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5500;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'page', 'login.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'page', 'login.html'));
});

app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, 'page', 'signup.html'));
})
app.get('/board', (req, res) => {
    res.sendFile(path.join(__dirname, 'page', 'board.html'));
});

app.get('/makepost', (req, res) => {
    res.sendFile(path.join(__dirname, 'page', 'makepost.html'));
});

app.get('/post?:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'page', 'viewpost.html'));
});

app.get('/editpost?:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'page', 'editpost.html'));
});


app.get('/user/editProfile', (req, res) => {
    res.sendFile(path.join(__dirname, 'page', 'editprofile.html'));
});

app.get('/user/editPassword', (req, res) => {
    res.sendFile(path.join(__dirname, 'page', 'editpassword.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on 'http://localhost:${PORT}`);
});