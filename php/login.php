<?php
if(isset($_GET["login"]))
{

$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "mydb";

$conn = new mysqli($servername, $username, $password, $dbname, 8889); // Lager tilkobling til MySQL

if ($conn->connect_error)
  die("Feil med tilkobling. " . $conn->connect_error);

session_start(); // Starter en session, kan nå lagre variabler i serveren

$LID = $_GET["LogInID"]; // Henter data fra innloggings-formen
$LP = $_GET["LogInPass"];

$_SESSION['SessionID'] = $LID; // Sender verdien til $LP (Passordet til brukeren) til serveren for å kunne hentes fra andre filer

$sql = "SELECT * FROM `Bruker` WHERE `BrukerID` = '$LID'"; // Hent det korresponderende passordet til den innlagte BrukerID'en
  
$resultat = $conn->query($sql);

while ($rad = mysqli_fetch_array($resultat)) {
  $forbindetPass = $rad['Passord']; // Lagrer det riktige passordet
}

if ($LP === $forbindetPass) { // Er det innlagte passordet lik med det riktige? Hvis så, send dem videre til annen side
  header("Location: oversikt.php");
  exit();
}
else if (empty($LID) || empty($LP)) // Sjekker at brukernavn og passord ikke er tomme variabler
{
  echo "Ingen passord skrevet inn / Ingen BrukerID skrevet inn.";
  echo "<br>";
  echo '<a href="javascript:history.back()">Gå tilbake</a>';
}
else // Feil passord dersom det ikke er likt $forbindetPass
{
  echo "Feil passord skrevet.";
  echo "<br>";
  echo '<a href="javascript:history.back()">Gå tilbake</a>';
}

$conn->close();
}
?>