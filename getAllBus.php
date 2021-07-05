<?php

//Access-Control-Allow-Origin header with wildcard.
header('Access-Control-Allow-Origin: *');

function connection() {
global $link;
$link = mysqli_connect("pi.cba.pl", "Bazapi2019", "Bazapi2019", "elunch_1");
    if (!mysqli_set_charset($link, "utf8")) {
        printf("Error loading character set utf8: %s\n", mysqli_error($link));
        exit();
    } else {
       // printf("Current character set: %s\n",
        mysqli_character_set_name($link);
    }
    if (!$link) {
        echo "Error: Unable to connect to MySQL." . PHP_EOL;
        echo "Debugging errno: " . mysqli_connect_errno() . PHP_EOL;
        echo "Debugging error: " . mysqli_connect_error() . PHP_EOL;
    exit; echo '<br><BR>Poprawne połączenie z bazą danych<BR>';
    }
// echo "Host information: " . mysqli_get_host_info($link) . PHP_EOL;
}

connection();
// $my_date = date("Y-m-d");  
// $idName = $_GET["idName"];
// $idIndex = $_GET["idIndex"];
// SELECT DISTINCT idName FROM `maps_records` WHERE idName
if($result = mysqli_query($link,"SELECT DISTINCT idName FROM `maps_records` WHERE idName order by `idName` DESC")){
    while($row = mysqli_fetch_assoc($result)) {
        $idName = $row['idName']; 
        $return_arr[] = $idName;        
    }

}

// Encoding array in JSON format
header('Content-Type: application/json');
echo json_encode($return_arr);
?>