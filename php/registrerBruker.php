<?php
if(isset($_GET["registrer"]))
{

$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "mydb";

$conn = new mysqli($servername, $username, $password, $dbname, 8889); // Lager tilkobling til MySQL

if ($conn->connect_error)
  die("Feil med tilkobling. " . $conn->connect_error);

$BID = $_GET["nyBrukerID"]; // Henter data fra registrerings-formen
$P = $_GET["nyPass"];

if (!empty($BID) && !empty($P)) // Sjekker at brukernavn og passord er skrevet inn
{
  $sql = "INSERT INTO `Bruker`(`BrukerID`, `Passord`) VALUES ('$BID','$P')";
}
else
{
  echo "Ingen passord skrevet inn / Ingen BrukerID skrevet inn.";
  echo "<br>";
  echo '<a href="javascript:history.back()">Gå tilbake</a>';
}

if ($conn->query($sql)) { // Sender informasjon til databasen
  echo "Brukeren " . $BID . " er nå registrert.";
  echo "<br>";
  echo '<a href="javascript:history.back()">Gå tilbake</a>';
}
else if($conn->errno === 1062) // Sjekker for Duplicate Primary Key error (Brukeren skrev en BrukerID som var i bruk)
{
  echo "Denne BrukerID'en er i bruk. Velg en annen.";
  echo "<br>";
  echo '<a href="javascript:history.back()">Gå tilbake</a>';
}
else if($conn->errno === 0) // Dersom en rar feil som er grunnet at dette if-statementet ikke er koblet til det over oppstår
{
  echo "";
}
else // Dersom andre feil oppstår
{
  echo "En feil oppsto.";
  echo "<br>";
  echo '<a href="javascript:history.back()">Gå tilbake</a>';
}

$conn->close();
}
?>