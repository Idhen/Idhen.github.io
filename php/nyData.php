<?php
if(isset($_GET["nyData"]))
{

$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "mydb";

$conn = new mysqli($servername, $username, $password, $dbname, 8889); // Kobler til databasen

if ($conn->connect_error)
  die("Feil med tilkobling. " . $conn->connect_error);

session_start();

$BID = $_SESSION["SessionID"];
$NN = $_GET["SideNavn"]; // Henter dataen fra ny data-formen
$NB = $_GET["SideBruker"];
$NP = $_GET["SidePass"];

$sql = "INSERT INTO `NettsideLogin`(`Nettside`, `LoginBrukernavn`, `LoginPassord`, `ID`) VALUES ('$NN', '$NB', '$NP', '$BID')"; // Sender variablene til databasen

if ($conn->query($sql) === TRUE) {
  echo "Nettsiden er registrert.";
  echo "<br>";
  echo '<a href="javascript:history.back()">Gå tilbake</a>'; // Lenke for å gå tilbake til hovedsiden
} else {
  echo "Noe gikk galt med oppretting av ny data";
}

$conn->close();
}
?>