<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Oversikt</title>
    <link rel="stylesheet" href="stil.css">

    <style>
      table { /* Stil for tabellen som viser innloggingsinformasjon */
        border-collapse: collapse;
        width: 50%;
        margin: auto;
        margin-top: 4em;
      }

      td, th {
        border-width: 2px;
        border-style: groove;
        border-color: threedface;
        border-image: initial;
        text-align: center;
        padding: 8px;
      }

      tr:nth-child(even) {
        background-color: #242424;
      }
    </style>
</head>
<body>
    <a href="/">Logg ut</a> <!--Link til hovedsiden-->

    <form action="nyData.php" method="GET"> <!--Form for å legge til ny data-->
        <fieldset style="width: 55%;">
          <legend>Registrer ny Nettside-login</legend>
          Nettside: <input type="text" name="SideNavn">
          Brukernavn: <input type="text" name="SideBruker">
          Passord: <input type="password" name="SidePass">
          <input type="submit" name="nyData">
        </fieldset>
    </form>

    <form action="slettData.php" method="GET"> <!--Form for å slette data-->
        <fieldset style="width: 55%;">
          <legend>Slett en Nettside-login</legend>
          Nettside: <input type="text" name="SlettSide">
          <input type="submit" name="slettData">
        </fieldset>
    </form>

    <br>
    
    <?php
    $servername = "localhost";
    $username = "root";
    $password = "root";
    $dbname = "mydb";
    
    $conn = new mysqli($servername, $username, $password, $dbname, 8889); // Kobler til databasen

    if ($conn->connect_error)
      die("Feil med tilkobling. " . $conn->connect_error);
    
    session_start(); // Gir denne filen tilgang til session variabler
    
    $BID = $_SESSION["SessionID"]; // Lagrer passordet fra login.php til en lokal fil

    $sql = "SELECT `NettsideLoginID`, `Nettside`, `LoginBrukernavn`, `LoginPassord`, `ID` FROM `NettsideLogin` WHERE `ID` = '$BID'"; // Henter nettsidedataen som tilhører den innloggende brukeren

    $resultat = $conn->query($sql);
    
    echo "<table>"; // Starter tabellen
    echo "<tr>"; // Lager en rad med overskrifter
    echo "<th>Nettside</th>";
    echo "<th>Brukernavn</th>";
    echo "<th>Passord</th>";
    echo "</tr>";
    while($rad = $resultat->fetch_assoc()) {
        $NS = $rad["Nettside"];
        $LB = $rad["LoginBrukernavn"];
        $LP = $rad["LoginPassord"];
        
        echo "<tr>";
        echo "<td>$NS</td>";
        echo "<td>$LB</td>";
        echo "<td>$LP</td>";
        echo "</tr>";
    }
    echo "</table>"; // Avslutter tabellen
    ?>
</body>
</html>