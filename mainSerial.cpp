#include <Arduino.h>
#include <TFT_eSPI.h>

TFT_eSPI tft = TFT_eSPI();

int threshold = 30;
bool touch2detected = false;
bool touch3detected = false;
bool touch4detected = false;
bool touch5detected = false;
bool touch9detected = false;
volatile bool touch3Handled = false;
uint8_t touch2Val = 0;
uint8_t touch3Val = 0;
uint8_t touch4Val = 0;
uint8_t touch5Val = 0;
uint8_t touch9Val = 0;
String inputLine = "";

void gotTouch2(){
  touch2detected = true;
  touch2Val = touchRead(T2);
}

void gotTouch3(){
  touch3detected = true;
  touch3Val = touchRead(T3);
}

void gotTouch4(){
  touch4detected = true;
  touch4Val = touchRead(T4);
}

void gotTouch5(){
  touch5detected = true;
  touch5Val = touchRead(T5);
}

void gotTouch9(){
  touch9detected = true;
  touch9Val = touchRead(T9);
}

void setup() {
  tft.init();
  tft.fillScreen(TFT_WHITE);
  tft.setRotation(1);
  tft.setCursor(0,20);
  tft.setTextColor(TFT_BLACK);
  tft.setTextSize(2);
  tft.println("Touch the big pad,");
  tft.println("save a note with the");
  tft.println("next, then playback!");
  Serial.begin(115200);
  delay(1000); // give me time to bring up serial monitor
  Serial.println("ESP32 Touch Interrupt Test");
  touchAttachInterrupt(T2, gotTouch2, threshold);
  touchAttachInterrupt(T3, gotTouch3, threshold);
  touchAttachInterrupt(T4, gotTouch4, threshold);
  touchAttachInterrupt(T5, gotTouch5, threshold);
  touchAttachInterrupt(T9, gotTouch9, threshold);
}

void loop(){
  //tft.println(touch2Val);
  if(touch2detected){
    touch2detected = false;
    Serial.println(2);
    //tft.println(touch2Val);
  }
  if(touch3detected){
    touch3detected = false;
    Serial.println(3);
    tft.fillScreen(TFT_WHITE);
    tft.setCursor(0,0);
  }
  if(touch4detected){
    touch4detected = false;
    Serial.println(4);
    //delay(1000);
  }
  if(touch5detected){
    touch5detected = false;
    Serial.println(5);
  }
  if(touch9detected){
    touch9detected = false;
    Serial.println(9);
  }
  if (Serial.available()) {
    //tft.println("incoming");
    //String incomingData = Serial.readString();
    int incomingData = Serial.parseInt();
    //tft.fillScreen(TFT_WHITE);

    if(incomingData == 1000){
      tft.fillScreen(TFT_WHITE);
      tft.setCursor(0,15);
      tft.println("Match the note we");
      tft.println("give you! Submit");
      tft.println("with the save button");
      tft.println("Playback with  >");
    } else {
      tft.print("You were ");
      tft.print(incomingData);
      tft.println(" hertz off!");
      tft.println(" ");
      tft.println(" ");
      tft.println(" ");
      tft.println(" ");
      tft.println(" ");
      tft.println(" ");
      tft.println(" ");
    }
 }
}