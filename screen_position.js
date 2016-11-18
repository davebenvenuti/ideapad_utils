const fs = require('fs');
const exec = require('child_process').exec;

var upsideDown = false;

function handleUpsideDown() {
    exec(__dirname + "/bin/handle-upside-down", function(err, stdout, stderr) {
        if(err) {
            console.error("error executing handle-upside-down", err);
        }
    });
}

function handleRightsideUp() {
    exec(__dirname + "/bin/handle-rightside-up", function(err, stdout, stderr) {
        if(err) {
            console.error("error executing handle-rightside-up", err);
        }
    });
}

function readAccelerometor() {
    fs.readFile(
        "/sys/bus/iio/devices/iio:device0/in_accel_y_raw",
        function(err, data){
            if(err) {
                console.error(err);
                process.exit(1);
            } else {
                let angleStr = data.toString();

                let angle = parseInt(angleStr);

                if((angle >= 100) && !upsideDown) {
                    console.log("Upside down!");
                    upsideDown = true;
                    handleUpsideDown();
                } else if((angle < 100) && upsideDown) {
                    console.log("Rightside Up!");
                    upsideDown = false;
                    handleRightsideUp();
                }
            }
        });
};

function readAndSchedule() {
    readAccelerometor();
    setTimeout(readAndSchedule, 2500);
};

readAndSchedule();
