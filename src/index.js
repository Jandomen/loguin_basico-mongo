const express = require('express')
const pasth = require('path')
const bcrypt = require('bcrypt')
const collection = require('./config')

const app = express()

app.use(express.json())

app.use(express.urlencoded({ extended: false }))


app.set('view engine', 'ejs')

app.use(express.static('public'))




app.get('/', (req, res) => {
    res.render('bienvenida')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/signup', (req, res) => {
    res.render('signup')
})


app.post('/signup', async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    }

    try {
        const existingUser = await collection.findOne({ name: data.name })
        if (existingUser) {
            res.send('El usuario ya existe. Por favor, utiliza uno diferente.')
        } else {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(data.password, saltRounds)

            data.password = hashedPassword

            const userData = await collection.create(data)
            console.log(userData);
            res.send('Usuario registrado exitosamente.')
        }
    } catch (error) {
        console.error('Error al crear usuario:', error)
        res.status(500).send('Error interno del servidor')
    }
});


app.post('/login', async (req, res) => {
    try {
       const user = await collection.findOne({name: req.body.username})
       if(!user) {
        res.send('El usuario no existe')
       }

       const isPasswordMatch = await bcrypt.compare(req.body.password, user.password)
       if(isPasswordMatch) {
        res.render('home')
       } else {
         req.send('Contraseña equivocada')
       }
    } catch (error) {
        console.error(error);
        res.send('Ocurrió un error al procesar la solicitud');
    }
    
})



app.get('/home', (req, res) => {
    res.render('home');
});


const port = 4000

app.listen(port, () => {
    console.log(`El servidor esta en el puerto: ${port}`)
})