#include <Arduino.h>
#include <TFT_eSPI.h>
#include <string>
#include <random>

// put function declarations here:
int myFunction(int, int);

TFT_eSPI tft = TFT_eSPI();

void setup() {
  // put your setup code here, to run once:
  int result = myFunction(2, 3);
  tft.init();
  tft.setRotation(2);
}

void loop() {
 std::string sentence[14] = {"Once", "upon", "a", "time", "I", "walked", "into", "the", "forest", "and", "saw", "the", "tiny", "people"};
 tft.fillScreen(TFT_BLACK);
 //delay(500);
 //tft.fillScreen(TFT_WHITE);
 tft.setCursor(3,20);
 tft.setTextColor(TFT_RED);
 tft.setTextSize(2);

 int currentWord = 0;
 while (currentWord < 14) {
  tft.fillScreen(TFT_BLACK);
  tft.setCursor(3,20);
  int randomNum = rand() % 5;
  std::string currentPhrase;
  for (int i = 0; i <= randomNum; i++) {
   if (currentWord + i < 14) {
    currentPhrase.append(" " + sentence[currentWord + i]);
   }
  }
  int length = currentPhrase.length();
  if (length < 4) {
   tft.setTextSize(6);
  } else if (length < 8) {
    tft.setTextSize(4);
  } else if (length < 12) {
    tft.setTextSize(3);
  } else {
    tft.setTextSize(2);
  }

  tft.println(currentPhrase.c_str());
  currentWord = currentWord + randomNum + 1;
  
  int randomDuration = rand() % 6 + 1;
  delay(randomDuration * 300);
 }
delay(500);
 
}

// put function definitions here:
int myFunction(int x, int y) {
  return x + y;
}
