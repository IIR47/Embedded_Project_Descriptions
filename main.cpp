#include <Arduino.h>
#include <TFT_eSPI.h>

TFT_eSPI tft = TFT_eSPI();

int threshold = 40;
bool touch2detected = false;
bool touch3detected = false;
bool touch4detected = false;
bool touch5detected = false;
bool touch9detected = false;
bool skiptherest = false;
bool dontdo4 = false;
volatile int touch9Count = 0;
unsigned long lastInterruptTime = 0;
unsigned long firstTouchTime = 0;
bool touch9double = false;
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
  unsigned long currentTime = millis();
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
    delay(50);
    if(touch9detected){
      dontdo4 = true;
    }
    delay(50);
    touch4detected = false;

    if(!dontdo4){
      Serial.println(4);
    }
    dontdo4 = false;
    //delay(1000);
  }
  if(touch5detected){
    touch5detected = false;
    Serial.println(5);
  }
  if(touch9detected){
    delay(70);
    if(touch4detected){
      Serial.println(6);
      skiptherest = true;
    }
    touch9detected = false;

    if(!skiptherest){
      if (touchRead(T9) < threshold) {
        if (currentTime - lastInterruptTime > 150) {
          if (touch9Count == 0) firstTouchTime = currentTime;
          touch9Count++;
          lastInterruptTime = currentTime;
        }
      }
    }
    skiptherest = false;
  }
  if(touch9Count > 0){
    if (currentTime - firstTouchTime > 350 || touch9Count >= 2) {
      if (touch9Count == 1) {
        Serial.println(9);
      } else {
        Serial.println(8);
      }

      touch9Count = 0;
      firstTouchTime = 0;
    }
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