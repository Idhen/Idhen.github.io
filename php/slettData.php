<?php
if(isset($_GET["slettData"]))
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
$S = $_GET["SlettSide"]; // Henter dataen fra ny data-formen

$sql = "DELETE FROM `NettsideLogin` WHERE `Nettside` = '$S' AND `ID` = '$BID'"; // Sender variablene til databasen

if ($conn->query($sql) === TRUE) {
  echo "Nettsiden er slettet.";
  echo "<br>";
  echo '<a href="javascript:history.back()">Gå tilbake</a>'; // Lenke for å gå tilbake til hovedsiden
} else {
  echo "Noe gikk galt med sletting av data";
}

$conn->close();
}
?>