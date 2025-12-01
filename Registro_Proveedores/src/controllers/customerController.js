const controller = {};
const bcrypt = require('bcryptjs');

controller.listaProveedores = (req, res) => {
  req.getConnection((err, conn) => {
    conn.query('SELECT * FROM  tb_Proveedores', (err, customers) => {
     if (err) {
      console.error('Error fetching proveedores:', err);
      return res.json(err);
     }
     // pass any query message to the view as error or msg
     const error = req.query && req.query.error ? req.query.error : undefined;
     const msg = req.query && req.query.msg ? req.query.msg : undefined;
      res.render('customers', {
        data: customers,
        providers: customers,
        error,
        msg
      });
    });
  });
};


controller.listaProductos = (req, res) => {
  
  const { idProductos } = req.params;
  req.getConnection((err, conn) => {
    conn.query('SELECT * FROM  tb_Productos', [idProductos], (err, rows) => {
      if (err) {
        console.error('Error fetching productos:', err);
        return res.json(err);
      }
      res.render('ConsultaProductos', {
        datas: rows
      })
    });
  });
};



controller.listaPedidos = (req, res) => {
  
  const { idPedido } = req.params;
  req.getConnection((err, conn) => {
    conn.query('SELECT * FROM  tb_Pedidos', [idPedido], (err, rows) => {
      if (err) {
        console.error('Error fetching pedidos:', err);
        return res.json(err);
      }
      res.render('ConsultaPedidos', {
        datapedido: rows
      })
    });
  });
};




controller.guardar=(req, res) =>{
  const data = req.body; // expects idUsuario & password
  const idUsuario = (data.idUsuario || '').toString().trim();
  const password = (data.password || '').toString();

  // validate alphanumeric username
  // require at least one letter and allow alphanumeric only
  if (!/^(?=.*[A-Za-z])[A-Za-z0-9]{1,50}$/.test(idUsuario)) {
    return res.status(400).render('register', {error: 'Usuario debe ser alfanumerico y contener al menos una letra (sin espacios), maximo 50 caracteres'});
  }
  if (password.length < 4) {
    return res.status(400).render('register', {error: 'Contrasena demasiado corta (min 4)'});
  }

  const hash = bcrypt.hashSync(password, 10);
  req.getConnection((err,conn)=>{
      conn.query('INSERT INTO tb_Usuarios (idUsuario, password) VALUES (?, ?)', [idUsuario, hash] , (err,usuarios) =>{
          if (err) {
            console.error('User registration error:', err.sqlMessage || err);
            if (err && err.code === 'ER_DUP_ENTRY') {
              return res.status(409).render('register', {error: 'El usuario ya existe'});
            }
            return res.status(500).render('register', {error: 'No se pudo crear usuario'});
          }
          res.redirect('/inicio');
      });
  });
};

// Show login or register depending on whether user records exist
controller.showInicio = (req, res) => {
  req.getConnection((err, conn) => {
    conn.query('SELECT COUNT(*) as cnt FROM tb_Usuarios', (err, rows) => {
      if (err) {
        console.error('Error checking users:', err);
        return res.status(500).send('Server error');
      }
      const cnt = rows && rows[0] ? rows[0].cnt : 0;
      if (cnt === 0) {
        return res.render('register');
      }
      return res.render('usuarios');
    });
  });
};

// Handle login
controller.login = (req, res) => {
  const idUsuario = req.body.idUsuario;
  const password = req.body.password;
  req.getConnection((err, conn) => {
    conn.query('SELECT * FROM tb_Usuarios WHERE idUsuario = ?', [idUsuario], (err, rows) => {
      if (err) {
        console.error('Login query error:', err);
        return res.status(500).render('usuarios', {error: 'Server error'});
      }
      if (!rows || rows.length === 0) {
        return res.status(401).render('usuarios', {error: 'Usuario no encontrado'});
      }
      const user = rows[0];
      const hashed = user.password;
      const ok = bcrypt.compareSync(password, hashed);
      if (ok) {
        // For now, simple redirect — session auth not implemented
        return res.redirect('/dashBoard');
      } else {
        return res.status(401).render('usuarios', {error: 'Contraseña incorrecta'});
      }
    });
  });
};


controller.guardarDireccion=(req, res) =>{
  const datadirec = req.body;
  // Validate numeric fields
  datadirec.idDomicilio = parseInt(datadirec.idDomicilio);
  datadirec.cp = parseInt(datadirec.cp);
  datadirec.numero = parseInt(datadirec.numero);
  if (isNaN(datadirec.idDomicilio)) return res.redirect('/dashBoard?error=' + encodeURIComponent('idDomicilio debe ser numerico'));
  req.getConnection((err,conn)=>{
      if (err) {
        console.error('DB connection error:', err);
        return res.redirect('/dashBoard?error=' + encodeURIComponent('DB connection error'));
      }
      conn.query('INSERT INTO tb_domicilio set ? ', [datadirec] , (err,result) =>{
        if (err) {
          console.error('Error inserting domicilio:', err.sqlMessage || err);
          return res.redirect('/dashBoard?error=' + encodeURIComponent('Error inserting domicilio: ' + (err.sqlMessage || err.message || err)));
        }
        return res.redirect('/dashBoard');
      });
  });
};

controller.guardarResponsable=(req, res) =>{
  const datarespon =req.body;
  req.getConnection((err,conn)=>{
      if (err) {
        console.error('DB connection error:', err);
        return res.redirect('/dashBoard?error=' + encodeURIComponent('DB connection error'));
      }
      conn.query('INSERT INTO tb_Responsable set ? ', [datarespon] , (err,result) =>{
            if (err && err.code === 'ER_DUP_ENTRY') {
              return res.redirect('/dashBoard?error=' + encodeURIComponent('Responsable con RFC ya existe'));
            }
        if (err) {
          console.error('Error inserting responsable:', err.sqlMessage || err);
          return res.redirect('/dashBoard?error=' + encodeURIComponent('Error inserting responsable: ' + (err.sqlMessage || err.message || err)));
        }
        return res.redirect('/dashBoard');
      });
  });
};

controller.guardarProveedor=(req, res) =>{
  const dataprovee =req.body;
  // Ensure idDomicilio exists (FK)
  dataprovee.idDomicilio = parseInt(dataprovee.idDomicilio);
  if (isNaN(dataprovee.idDomicilio)) return res.redirect('/dashBoard?error=' + encodeURIComponent('IdDomicilio invalido'));
  req.getConnection((err,conn)=>{
      if (err) {
        console.error('DB connection error:', err);
        return res.redirect('/dashBoard?error=' + encodeURIComponent('DB connection error'));
      }
      // validate related domicilio exists
      conn.query('SELECT idDomicilio FROM tb_domicilio WHERE idDomicilio = ?', [dataprovee.idDomicilio], (err2, rows2) => {
        if (err2) { console.error('Check domicilio error:', err2); return res.redirect('/dashBoard?error=' + encodeURIComponent('Server error')); }
        if (!rows2 || rows2.length === 0) return res.redirect('/dashBoard?error=' + encodeURIComponent('Id Domicilio no existe'));
        conn.query('INSERT INTO tb_Proveedores set ? ', [dataprovee] , (err,result) =>{
        if (err) {
          console.error('Error inserting proveedor:', err.sqlMessage || err);
          return res.redirect('/dashBoard?error=' + encodeURIComponent('Error inserting proveedor: ' + (err.sqlMessage || err.message || err)));
        }
        return res.redirect('/dashBoard');
        });
      });
  });
};

controller.guardarProducto=(req, res) =>{
  const dataprodcuto =req.body;
  req.getConnection((err,conn)=>{
      if (err) {
        console.error('DB connection error:', err);
        return res.redirect('/dashBoard?error=' + encodeURIComponent('DB connection error'));
      }
      // verify proveedor exists if provided
      const provId = parseInt(dataprodcuto.idProveedores);
      if (isNaN(provId)) {
        return res.redirect('/dashBoard?error=' + encodeURIComponent('Seleccione un proveedor valido'));
      }
      if (!isNaN(provId)) {
        conn.query('SELECT idProveedores FROM tb_Proveedores WHERE idProveedores = ?', [provId], (err2, rows2) => {
          if (err2) { console.error('Check proveedor error:', err2); return res.redirect('/listaProductos?error=' + encodeURIComponent('Server error')); }
          if (!rows2 || rows2.length === 0) return res.redirect('/dashBoard?error=' + encodeURIComponent('IdProveedor no existe'));
          conn.query('INSERT INTO tb_Productos set ? ', [dataprodcuto] , (err,result) =>{
        if (err) {
          console.error('Error inserting producto:', err.sqlMessage || err);
          return res.status(500).send('Error inserting producto');
        }
        return res.redirect('/listaProductos');
          });
        });
      } else {
        conn.query('INSERT INTO tb_Productos set ? ', [dataprodcuto] , (err,result) =>{
          if (err) {
            console.error('Error inserting producto:', err.sqlMessage || err);
            return res.redirect('/dashBoard?error=' + encodeURIComponent('Error inserting producto: ' + (err.sqlMessage || err.message || err)));
          }
          return res.redirect('/dashBoard?msg=' + encodeURIComponent('Producto agregado'));
        });
      }
  });
};
controller.guardarPedido=(req, res) =>{
  const datapedido =req.body;
  req.getConnection((err,conn)=>{
      if (err) {
        console.error('DB connection error:', err);
        return res.redirect('/dashBoard?error=' + encodeURIComponent('DB connection error'));
      }
      // verify producto exists
      const prodId = datapedido.idProductos;
      conn.query('SELECT idProductos FROM tb_Productos WHERE idProductos = ?', [prodId], (err2, rows2) => {
        if (err2) { console.error('Check producto error:', err2); return res.redirect('/listaPedidos?error=' + encodeURIComponent('Server error')); }
          if (!rows2 || rows2.length === 0) return res.redirect('/listaPedidos?error=' + encodeURIComponent('IdProducto no existe'));
        conn.query('INSERT INTO tb_Pedidos set ? ', [datapedido] , (err,result) =>{
        if (err) {
          console.error('Error inserting pedido:', err.sqlMessage || err);
          return res.redirect('/listaPedidos?error=' + encodeURIComponent('Error inserting pedido: ' + (err.sqlMessage || err.message || err)));
        }
        return res.redirect('/listaPedidos?msg=' + encodeURIComponent('Pedido agregado'));
        });
      });
  });
};




controller.save = (req, res) => {
  const data = req.body;
  console.log(req.body)
  req.getConnection((err, connection) => {
    const query = connection.query('INSERT INTO customer set ?', data, (err, customer) => {
      console.log(customer)
      res.redirect('/');
    })
  })
};

controller.edit = (req, res) => {
  const { idProveedores } = req.params;
  req.getConnection((err, conn) => {
    conn.query("SELECT * FROM tb_Proveedores WHERE idProveedores = ?", [idProveedores], (err, rows) => {
      res.render('customers_edit', {
        data: rows[0]
      })
    });
  });
};

controller.update = (req, res) => {
  const { idProveedores } = req.params;
  const newCustomer = req.body;
  req.getConnection((err, conn) => {

  conn.query('UPDATE tb_Proveedores set ? where idProveedores = ?', [newCustomer, idProveedores], (err, rows) => {
    res.redirect('/');
  });
  });
};


controller.editproductos = (req, res) => {
  const { idProductos } = req.params;
  req.getConnection((err, conn) => {
    conn.query("SELECT * FROM tb_Productos WHERE idProductos = ?", [idProductos], (err, rows) => {
      res.render('productos_edit', {
        datas: rows[0]
      })
    });
  });
};

controller.updateproductos = (req, res) => {
  const { idProductos } = req.params;
  const newCustomer = req.body;
  req.getConnection((err, conn) => {

  conn.query('UPDATE tb_Productos set ? where idProductos = ?', [newCustomer, idProductos], (err, rows) => {
    res.redirect('/');
  });
  });
};

controller.editpedidos = (req, res) => {
  const { idPedido } = req.params;
  req.getConnection((err, conn) => {
    conn.query("SELECT * FROM tb_Pedidos WHERE idPedido = ?", [idPedido], (err, rows) => {
      res.render('pedidos_edit', {
        datapedido: rows[0]
      })
    });
  });
};

controller.updatepedidos = (req, res) => {
  const { idPedido } = req.params;
  const newCustomer = req.body;
  req.getConnection((err, conn) => {

  conn.query('UPDATE tb_Pedidos set ? where idPedido = ?', [newCustomer, idPedido], (err, rows) => {
    res.redirect('/');
  });
  });
};











controller.delete = (req, res) => {
  const { idProveedores } = req.params;
  req.getConnection((err, connection) => {
    connection.query('DELETE FROM tb_Proveedores WHERE idProveedores = ?', [idProveedores], (err, rows) => {
      res.redirect('/');
    });
  });
}
controller.deleteProductos = (req, res) => {
  const { idProductos } = req.params;
  req.getConnection((err, connection) => {
    connection.query('DELETE FROM tb_Productos WHERE idProductos = ?', [idProductos], (err, rows) => {
      res.redirect('/listaProductos');
    });
  });
}

controller.deletePedidos = (req, res) => {
  const { idPedido } = req.params;
  req.getConnection((err, connection) => {
    connection.query('DELETE FROM tb_Pedidos WHERE idPedido = ?', [idPedido], (err, rows) => {
      res.redirect('/listaPedidos');
    });
  });
}

module.exports = controller;
