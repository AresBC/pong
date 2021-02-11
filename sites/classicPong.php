<?php
$pathToComponents = '../layout/';
require_once $pathToComponents . 'header.php';
?>


<?php
require_once $pathToComponents . 'navbar.php';
?>

<div class="container">
    <div class="row">
        <div class="col">
            <!-- <img id="main_img" src="pongExmaple.png" /> -->
            <div id="game"></div>
        </div>
        <div class="col col-10">
            <p>
                Mit dem Urgestein der Viedeospielgeschichte legte 1972 Atari einen Meilenstein. Zuerst erschien Pong auf
                Geräten in Spielhallen. Später wurde es das erste erfolgreiche Spiel für den Heimgebrauch.
            </p>
        </div>
    </div>
</div>
<script defer src="../games/gameLibary.js" type="text/javascript"></script>
<script defer src="../games/pong.js" type="text/javascript"></script>
<script defer src="../games/classicPong.js" type="text/javascript"></script>


<?php
require_once $pathToComponents . 'footer.php';
?>
