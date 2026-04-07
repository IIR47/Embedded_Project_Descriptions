//when the user clicks anywhere on the page
document.addEventListener('click', async () => {
  
  // Prompt user to select any serial port.
  var port = await navigator.serial.requestPort();
  // be sure to set the baudRate to match the ESP32 code
  await port.open({ baudRate: 115200 });

  let decoder = new TextDecoderStream();
  inputDone = port.readable.pipeTo(decoder.writable);
  inputStream = decoder.readable;

  reader = inputStream.getReader();
  writer = port.writable.getWriter();
  readLoop();

});

let buffer = "";

async function readLoop() {
  let counterVal = 0;
  const synth = new Tone.Synth().toDestination();
  const encoder = new TextEncoder();

  let array = [];
  let itsokay3 = true;
  let itsokay4 = true;
  let popthatglitch = false;
  let createmode = true;
  let targetnote = 0;
  let itsokay9 = true;
  let nonewnote = false;

  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      // Allow the serial port to be closed later.
      console.log("closing connection")
      reader.releaseLock();
      break;
    }
    if (value) {
      console.log(`sent value: ${value}`);
      //const parsedVal = parseInt(value);
      let parsedVal = value[0];
      //console.log(`going into if`);
      
      console.log(parsedVal)

      if (parsedVal == 3) {
        //console.log(`in 3. itsokay: ${itsokay3}`);
        if(itsokay3){
          if(createmode){
            //synth.triggerAttackRelease((counterVal % 800) + 20, "8n", Tone.now() + 0.02);
            array.push((counterVal % 800) + 20)
            console.log(`pushed. itsokay: ${itsokay3}`);
          }
          if(!createmode && !nonewnote){
            let difference = Math.abs((counterVal % 800) + 20 - targetnote);
            console.log(`difference: ${difference}`);
            await writer.write(encoder.encode(difference + "\n"));
            console.log(`sent: ${difference}`);
            //await writer.write(data); // Send data to the device
            //await writer.write(encoder.encode("hello\n"));
            //writer.releaseLock(); // Release the lock to allow closing later
            setTimeout(() => {
              console.log("sending a new note");
              targetnote = Math.floor(Math.random() * (800 + 1)) + 20;
              synth.triggerAttackRelease(targetnote, "8n", Tone.now() + 0.02);
            }, 3000);
            nonewnote = true;
            setTimeout(() => {
              nonewnote = false;
            }, 4000);
          }

          itsokay3 = false;

          setTimeout(() => {
            itsokay3 = true;
            console.log(`timeout 3. itsokay3: ${itsokay3}`);
          }, 1000);
          
          popthatglitch = true;
          //for stupid glitch
          setTimeout(() => {
            popthatglitch = false;
            //console.log(`glitch timeout');
          }, 500);
        }
        parsedVal = 0;

        //console.log(`end 3. itsokay: ${itsokay3}`);
        continue;
        console.log(`after continue 3`);
      }
      if (parsedVal == 2) {
        //console.log(`in 2`);
        counterVal += 2;
        //parseInt(value);
        //add a tiny bit extra to the time to make Tone.js happy
        synth.triggerAttackRelease((counterVal % 800) + 20, "8n", Tone.now() + 0.01); //(counterVal % 800) + 20.  Tone.now()+counterVal/8000)
        //console.log(`end of 2`);
        continue;
        console.log(`after continue 2`);
      }
      if (parsedVal == 4) {
        //console.log(`in 4`);
        //console.log(array);
        if(!createmode){
          synth.triggerAttackRelease(targetnote, "8n", Tone.now() + 0.02);
        }

        if(itsokay4 && createmode){
          if(popthatglitch){
            array.pop();
          }
          let startTime = Tone.now();
          array.forEach((note, i) => {
            synth.triggerAttackRelease(note, "8n", startTime + i * 0.5);
            //console.log(`note done: ${note}`);
          });
          itsokay4 = false;

          setTimeout(() => {
            itsokay4 = true;
            //console.log(`timeout 4. itsokay4: ${itsokay4}`);
          }, 1000);
        }

        //console.log(`end of 4`);
        continue;
      }
      if (parsedVal == 5) {
        //console.log(`in 5`);
       
        array = []
        //console.log(array);

        //console.log(`end of 5`);
        continue;
      }
      if (parsedVal == 9) {
        //console.log(`in 9`);
        
        if(itsokay9){
          createmode = !createmode;
          console.log(`create mode: ${createmode}`);

          if(!createmode){
            await writer.write(encoder.encode("1000")); //1000 is a code
            targetnote = Math.floor(Math.random() * (800 + 1)) + 20;
            synth.triggerAttackRelease(targetnote, "8n", Tone.now() + 0.02);
            console.log(`target note: ${targetnote}`);
          }  
          
          itsokay9 = false;

          setTimeout(() => {
              itsokay9 = true;
              //console.log(`timeout 3. itsokay9: ${itsokay9}`);
            }, 2000);
        }
        //console.log(`end of 9`);
        continue;
      }
    }
  }
};
