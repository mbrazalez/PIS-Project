function CAD(){
    const mongo = require("mongodb").MongoClient;
    const ObjectId = require('mongodb').ObjectId;
    this.usuarios;

    this.conectar=async function(callback){
        try{
            let cad = this;
            let client = new
            mongo("mongodb+srv://mbrazalez:chanchi@cluster0.bi8a5yc.mongodb.net/?retryWrites=true&w=majority");
            await client.connect();
            const database = client.db("sistema");
            cad.usuarios = database.collection("usuarios");
            callback(database);
        }catch(error){
            console.log(error);
        }
    }

    this.buscarOCrearUsuario=function(usr,callback){
        buscarOCrear(this.usuarios,usr,callback);
    }
    
    function buscarOCrear(coleccion,criterio,callback){
        coleccion.findOneAndUpdate(
            criterio, 
            {$set: criterio}, 
            {upsert: true,returnDocument:"after",projection:{email:1}}, 
            function(err,doc) {
                if (err) { throw err; }
                else {
                    console.log("Elemento actualizado");
                    console.log(doc.value.email);
                    callback({email:doc.value.email});
                }
            });
    }

    this.buscarUsuario=function(criterio, callback){
        buscar(this.usuarios,criterio,callback);
    }

    this.insertarUsuario=function(usuario,callback){
        insertar(this.usuarios,usuario,callback);
    }

    function buscar(coleccion,criterio,callback){
        coleccion.find(criterio).toArray(function(error,coleccion){
            if (coleccion.length==0){
                callback(undefined);
            }
            else{
                callback(coleccion[0]);
            }
        });
    }

    function insertar(coleccion,elemento,callback){
        coleccion.insertOne(elemento,function(err,result){
            if(err){
                console.log("error");
            }else{
                console.log("Nuevo elemento creado");
                callback(elemento);
            }
        });
    }

    this.actualizarUsuario=function(obj,callback){
        actualizar(this.usuarios,obj,callback);
    }

    function actualizar(coleccion,obj,callback){
        coleccion.findOneAndUpdate({_id:ObjectId(obj._id)}, {$set: obj},
        {upsert: false,returnDocument:"after",projection:{email:1}}, function(err,doc) {
            if (err) { throw err; }
            else {
                console.log("Elemento actualizado");
                //console.log(doc);
                //console.log(doc);
                callback({email:doc.value.email});
            }
        });
    }
}

module.exports.CAD = CAD;