/*
* Copyright (c) 2015 - 2016 Intel Corporation.
*
* Permission is hereby granted, free of charge, to any person obtaining
* a copy of this software and associated documentation files (the
* "Software"), to deal in the Software without restriction, including
* without limitation the rights to use, copy, modify, merge, publish,
* distribute, sublicense, and/or sell copies of the Software, and to
* permit persons to whom the Software is furnished to do so, subject to
* the following conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
* MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
* LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
* OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
* WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

"use strict";

var exports = module.exports = {};

// Initialize the DFRobot hardware devices
var mic = require("jsupm_mic");
var sound = new mic.Microphone(1), // A1
    vibration = new (require("jsupm_grove").GroveButton)(16), // aka A2
    screen = new (require("jsupm_i2clcd").SAINSMARTKS)(8, 9, 4, 5, 6, 7, 0);

// Initialize the sound sensor
var ctx = new mic.thresholdContext();
ctx.averageReading = 0;
ctx.runningAverage = 0;
ctx.averagedOver = 2;

exports.init = function(config) {
  return;
}

// Display a warning message on the I2C LCD display
exports.warn = function() {
  screen.setCursor(0, 0);
  screen.write("EQUIPMENT IN USE");
}

// Clears the LCD display
exports.clear = function() {
  screen.setCursor(0, 0);
  screen.write("                ");
}

// reads vibration sensor (low when triggered)
exports.getVibration = function(t) {
  var val = vibration.value();
  return (val == 0);
}

// reads audio level from mic
exports.getNoise = function(t) {
  var buffer = new mic.uint16Array(128),
      len = sound.getSampledWindow(2, 128, buffer);

  if (!len) { return; }

  var noise = sound.findThreshold(ctx, t, buffer, len);
  return noise;
}
