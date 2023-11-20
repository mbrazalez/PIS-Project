const datos = require("./cad.js");
const correo = require("./email.js");
const bcrypt = require("bcrypt");

function Sistema(){
    const datos = require('./cad.js');
    this.usuarios={};
    this.cad = new datos.CAD();


    this.agregarUsuario=function(email){
        let res = {email:-1}
        console.log("Agregando usuario "+email);
        if (this.usuarios[email]){
            console.log("El usuario "+email+" ya existe");
        }else{
            this.usuarios[email]=new Usuario(email);
            res.email=email;
            console.log("Usuario "+email+" ha sido registrado");
        }
        return res;
    }

    this.obtenerUsuarios=function(){
        let list = Object.keys(this.usuarios);
        if (list.length==0)
            return {usuarios:-1};
        return {usuarios: this.usuarios};
    }

    this.obtenerTodosemail=function(){
        return Object.keys(this.usuarios);
    }
    
    this.usuarioActivo=function(email){
        let res={activo:false};
        res.activo=(email in this.usuarios);
        return res;
    }
    
    this.eliminarUsuario=function(email){
        let res={"usuario_eliminado":-1};
        if (this.usuarios[email]){
            delete(this.usuarios[email]);
            console.log("Se ha eliminado el usuario con email " + email);
            res.usuario_eliminado = email;
        }
        else {
            console.log("No existe un usuario con email " + email);
        }
        return res;
    }

    this.numeroUsuarios=function(){
        let list = Object.keys(this.usuarios);
        return {num: list.length};
    }

    this.registrarUsuario=function(obj,callback){
        let modelo=this;
        if (!obj.email){
            obj.email=obj.email;
        }
        this.cad.buscarUsuario({"email":obj.email},function(usr){
            if (!usr){
                //el usuario no existe, luego lo puedo registrar
                obj.key=Date.now().toString();
                obj.confirmada=false; 
                bcrypt.hash(obj.password, 10, function (err, hash) {
                    obj.password = hash;
                    modelo.cad.insertarUsuario(obj,function(res){
                        callback(res);
                    });
                });
                //console.log/({obj});
                //correo.enviarEmail(obj.email,obj.key,"Confirmar cuenta");
                if (!modelo.test){
                    correo.enviarEmail(obj.email,obj.key,"Confirmar cuenta")
                }
            }
            else
            {
                callback({"email":-1});
            }
        });
    }

    this.loginUsuario = function (obj, callback) {
        let modelo = this;
        this.cad.buscarUsuario(
          { email: obj.email, confirmada: true },
          function (usr) {
            if (!usr) {
              callback({ email: -1 });
              return -1;
            } else {
              bcrypt.compare(obj.password, usr.password, function (err, result) {
                if (err) {
                  console.error("Error al comparar contraseñas:", err);
                  callback({
                    email: -1,
                    mensaje: "Error al comparar contraseñas",
                  });
                } else if (result) {
                    callback(usr); // Contraseña válida
                } else {
                  callback({ email: -1, mensaje: "Contraseña incorrecta" }); // Contraseña incorrecta
                }
              });
            }
          }
        );
      };
        
    this.usuarioGoogle=function(usr,callback){
        this.cad.buscarOCrearUsuario(usr,function(obj){
            callback(obj);
        });
    };

    this.confirmarUsuario=function(obj,callback){
        let modelo=this;
        this.cad.buscarUsuario({email:obj.email,confirmada:false,key:obj.key},function(usr){
            if (usr){
                usr.confirmada=true;
                modelo.cad.actualizarUsuario(usr,function(res){
                    callback({"email":res.email}); //callback(res)
                })
            }
            else
            {
                callback({"email":-1});
            }
        })
    };

    this.usuarioOAuth = function (usr, callback) {
        let copia = usr;
        usr.confirmada = true;
        this.cad.buscarOCrearUsuario(usr, function (obj) {
          if (obj.email == null) {
            console.log("El usuario " + usr.email + " ya estaba registrado");
            obj.email = copia;
          }
          callback(obj);
        });
    };

    correo.conectar(function(res){
        console.log("Variables secretas obtenidas");
        console.log(res);
    });

    this.cad.conectar(function(db){
        console.log("Conectado a la base de datos");
    });

}

function Usuario(email){
    this.nick=email;
    this.email=email;
    this.email;
    this.clave;
    this.apellidos;
    this.telefono;
}

module.exports.Sistema=Sistema;
