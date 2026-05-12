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
  const poly = new Tone.PolySynth(Tone.Synth).toDestination();
  const encoder = new TextEncoder();

  let array1 = [];
  let array2 = [];
  let arraymode = 1;
  let itsokay3 = true;
  let itsokay4 = true;
  let popthatglitch = false;
  let createmode = true;
  let targetnote = 0;
  let itsokay9 = true;
  let nonewnote = false;
  let godownnotes = false;


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
      
      console.log(`parsedVal: ${parsedVal}`);

      if (parsedVal == 3) {
        //console.log(`in 3. itsokay: ${itsokay3}`);
        if(itsokay3){
          if(createmode){
            //synth.triggerAttackRelease((counterVal % 800) + 20, "8n", Tone.now() + 0.02);
            if(arraymode == 1){
              array1.push((counterVal % 800) + 20)
            }else{
              array2.push((counterVal % 800) + 20)
            }
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
              if(!createmode){
                console.log("sending a new note");
                targetnote = Math.floor(Math.random() * (800 + 1)) + 20;
                synth.triggerAttackRelease(targetnote, "8n", Tone.now() + 0.02);
              }
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
        if(!godownnotes){
          counterVal += 2;
        } else {
          counterVal -= 2;
        }
        //parseInt(value);
        //add a tiny bit extra to the time to make Tone.js happy
        synth.triggerAttackRelease((counterVal % 800) + 20, "8n", Tone.now() + 0.01); //(counterVal % 800) + 20.  Tone.now()+counterVal/8000)
        //console.log(`end of 2`);
        continue;
        console.log(`after continue 2`);
      }
      if (parsedVal == 4) {
        //console.log(`in 4`);
        //console.log(array1);
        if(!createmode){
          synth.triggerAttackRelease(targetnote, "8n", Tone.now() + 0.02);
        }

        if(itsokay4 && createmode){
          if(popthatglitch){
            if(arraymode == 1){
              array1.pop();
            }else{
              array2.pop();
            }
          }
          
          let startTime = Tone.now();
          let length = Math.max(array1.length, array2.length);
          
          for (let i = 0; i < length; i++) {
            poly.triggerAttackRelease([array1[i], array2[i]], "8n", startTime + i * 0.5);
          }

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
       
        if(arraymode == 1){
          array1 = []
        }else{
          array2 = []
        }
        
        //console.log(array1);

        //console.log(`end of 5`);
        continue;
      }
      if (parsedVal == 9) {
        console.log(`in 9`);

        itsokay9 = true;
        if(itsokay9){

            createmode = !createmode;
            console.log(`create mode: ${createmode}`);

            if(!createmode){
              await writer.write(encoder.encode("1000")); //1000 is a code
              targetnote = Math.floor(Math.random() * (800 + 1)) + 20;
              synth.triggerAttackRelease(targetnote, "8n", Tone.now() + 0.02);
              console.log(`target note: ${targetnote}`);
            }  
          
          //itsokay9 = false;

        }
          
        //console.log(`end of 9`);
        continue;
      }
      if (parsedVal == 8) {
        console.log('888888888888888888888')
        godownnotes = !godownnotes;
      }
      if (parsedVal == 6) {
        console.log('66666666666666666')
        arraymode = 3 - arraymode;
        let startTime = Tone.now();
        if(arraymode == 1){
          array1.forEach((note, i) => {
          synth.triggerAttackRelease(note, "8n", startTime + i * 0.5);
          //console.log(`note done: ${note}`);
          });
        }
        if(arraymode == 2){
          array2.forEach((note, i) => {
          synth.triggerAttackRelease(note, "8n", startTime + i * 0.5);
          //console.log(`note done: ${note}`);
          });
        }
      }
    }
  }
};
