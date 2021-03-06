const {registerUser,authUser,editUser,addLink} = require('./query_user')
const {forgotPassword} = require('../email/email_sender')

const apiUser = (app) => {
    app.post('/api/reg', async (request, response) => { //Зарегистрировать пользователя
        try {
            const username = request.body.username;
            const email = request.body.email;
            const password = request.body.password;
            const image = request.files.image; //последнее свойство как название файла
            const img_url = image.name;
            await registerUser(username,email,password,img_url);
            await image.mv(`${__dirname}/../../media/avatars/${img_url}`);
            response.send("Пользователь " + username + " успешно создан!");
        }catch (e){
            response.send("Что-то пошло не так.... "+e.toString());
        }
    });

    app.post('/api/auth', async (request, response)=>{ //Авторизовать пользователя
        const username = request.body.username;
        const password = request.body.password;
        try{
            const auth_obj = await authUser(username,password);
            response.status(200).json(auth_obj);
        }catch (e){
            response.status(401).send(e);
        }
    });

    app.post('/api/edit_user', async (request, response)=>{ //Редактировать юзернейм
        const username = request.body.username;
        const password = request.body.password;
        const token = request.body.token;
        try{
            await editUser(username,password,token);
            response.status(200).send('Профиль отредактирован!');
        }catch (e){
            response.status(401).send(e);
        }
    });

    app.post('/api/forgot_password', async (request, response)=>{ //Если забыли пароль
        const email = request.body.email;
        try{
            await forgotPassword(email);
            response.status(200).send('Проверьте свою почту!');
        }catch (e){
            response.status(401).send(e);
        }
    });

    app.post('/api/add_link', async (request, response) => { //Добавить пользователя
        let username = request.body.username;
        let url = request.body.url;
        let link_name = request.body.link_name;
        let token = request.body.token;
        if(token === null){
            request.status(401).send("Ошибка авторизации");
        }
        try {
            let link = await addLink(username,url,link_name,token);
            response.send("Привязана ссылка "+link.link_name);
        }catch (e){
            response.status(401).send(e);
        }
    });
}

module.exports = {
    apiUser,
}





// app.post('/api/file', async (request,response) => {
//     const file = request.files.file;
//     await file.mv(`${__dirname}/../media/${file.name}`, error => {
//         if (error) {
//             console.error(error);
//             return response.status(500).send(error);
//         }
//         response.json({filename: file.name, filePath: `media/${file.name}`});
//     });
// });
// app.get('/redirect', (request, response) => {
//     response.redirect('/abcd');
// });
//
// app.get('/file', function (req, res) {
//     let file = `${__dirname}/../static/file.txt`;
//     res.download(file);
// });
//
//
// app.get('/user', function (req, res) {
//     res.send("Бла бла бла бла бла");
// });
//
// app.get('/json', function (req, res) {
//     res.json({
//         key: "value"
//     });
// });
