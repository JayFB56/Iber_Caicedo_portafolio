<?php
    $correo = $_POST['correo'];
    $password = $_POST['nombre'];
    $edad = $_POST['edad'];
    $sexo = $_POST['sexo'];
    $direccion = $_POST['direccion'];
    
    echo $cedula. "<br>";
    echo $nombre. "<br>";
    echo $edad. "<br>";
    echo $sexo. "<br>";
    echo $direccion. "<br>";

    $sintomas = "";
    $porcentaje = 0;

    if(!empty($_POST['resultados'])){
        foreach($_POST['resultados'] as $seleccionado){
            echo "<p>".$seleccionado ."</p>";
            $sintomas .= $seleccionado .",";
            $porcentaje += 1;
        }
        $infeccion = $porcentaje*10;
    }

    echo "Usted tiene un ".$infeccion ."% <br>";
?>