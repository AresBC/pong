<?php
function roundBySize($number, $size)
{
    $size = pow(10, $size);
    $number *= $size;
    $number = (int)$number;
    $number /= $size;
    return $number;
}

$screenSizes = [
    'uhd' => 3840,
    'fhd' => 1920,
];

function grid($number)
{
    $padding = 0;
    echo '<pre>';
    echo '
        .row {
            display: flex;
            justify-content: center; 
            flex-wrap: wrap;
        }
        
        .col {
            padding: ' . $padding . 'px;
        }
        
        .col > * {
            margin: 0;
        }

';

    for ($width = 600; $width < 8000; $width += 300) {
        echo "@media only screen and (min-width: " . $width . "px) {";
        for ($i = 1; $i <= $number; $i++) {

            echo "\n\t";
            echo '.col-' . $i . '{';
            echo "\n\t\t";
            echo 'width: ' . ($width - $padding * $number) / $number * $i . 'px;';
            echo "\n\t";
            echo '}';
            echo "\n";

        }
        echo "}";
        echo "\n";
    }
    echo '</pre>';
}

grid(12);