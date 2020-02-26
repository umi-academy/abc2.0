/*
Copyright (C): UMI Academy
modified from Ninh.D.H
load dependency
"mbit": "file:../pxt-mbit"
*/



//% color="#87CEEB" weight=24 icon="\uf1b6"
namespace UMI_Sensor {

	export enum enSensor {

        //% blockId="sensor1" block="SENSOR_1"
        sensor1 = 1,
        //% blockId="sensor2" block="SENSOR_2"
        sensor2 = 2,
        //% blockId="sensor3" block="SENSOR_3"
        sensor3 = 3,
    }

    export enum enAnaSensor {
        //% blockId="sensorana2" block="SENSOR_2"
        sensor2 = 2,
        //% blockId="sensorana3" block="SENSOR_3"
        sensor3 = 3,
    }
   
    //% blockId=mbit_ultrasonic_car block="read ultrasonic sensor port|%port|(cm)"
    //% color="#006400"
    //% weight=98
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Ultrasonic_Car(port: enSensor): number {
    	let d;
    	if (port == enSensor.sensor1) {
        	pins.setPull(DigitalPin.P12, PinPullMode.PullNone);
        	pins.digitalWritePin(DigitalPin.P12, 0);
        	control.waitMicros(5);
        	pins.digitalWritePin(DigitalPin.P12, 1);
        	control.waitMicros(15);
        	pins.digitalWritePin(DigitalPin.P12, 0);
       		// read pulse
       		d = pins.pulseIn(DigitalPin.P13, PulseValue.High, 43200);
    	}
    	if (port == enSensor.sensor2) {
        	pins.setPull(DigitalPin.P14, PinPullMode.PullNone);
        	pins.digitalWritePin(DigitalPin.P14, 0);
        	control.waitMicros(5);
        	pins.digitalWritePin(DigitalPin.P14, 1);
        	control.waitMicros(15);
        	pins.digitalWritePin(DigitalPin.P14, 0);
       		// read pulse
       		d = pins.pulseIn(DigitalPin.P1, PulseValue.High, 43200);
    	}
    	if (port == enSensor.sensor3) {
        	pins.setPull(DigitalPin.P15, PinPullMode.PullNone);
        	pins.digitalWritePin(DigitalPin.P15, 0);
        	control.waitMicros(5);
        	pins.digitalWritePin(DigitalPin.P15, 1);
        	control.waitMicros(15);
        	pins.digitalWritePin(DigitalPin.P15, 0);
       		// read pulse
       		d = pins.pulseIn(DigitalPin.P2, PulseValue.High, 43200);
    	}
        return  Math.floor(d / 58);
    }

    //% blockId=mbit_digtal block="read digital port|%port|"
    //% color="#006400"
    //% weight=98
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function digitalRead(port: enSensor): number {
    	let digi;
    	if (port == enSensor.sensor1) {
        	pins.setPull(DigitalPin.P12, PinPullMode.PullUp);
        	digi = pins.digitalReadPin(DigitalPin.P12);
    	}
    	if (port == enSensor.sensor2) {
        	pins.setPull(DigitalPin.P14, PinPullMode.PullUp);
        	digi = pins.digitalReadPin(DigitalPin.P14);
    	}
    	if (port == enSensor.sensor3) {
        	pins.setPull(DigitalPin.P15, PinPullMode.PullUp);
        	digi = pins.digitalReadPin(DigitalPin.P15);
    	}
        return digi;
    }

    //% blockId=mbit_analog block="read analog port|%port|"
    //% color="#006400"
    //% weight=98
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function analogRead(port: enAnaSensor): number {
    	let analog;
    	if (port == enAnaSensor.sensor2) {
        	analog = pins.analogReadPin(AnalogPin.P1);
    	}
    	if (port == enAnaSensor.sensor3) {
        	analog = pins.analogReadPin(AnalogPin.P2);
    	}
        return analog;
    }
}


//% color="#006400" weight=20 icon="\uf185"
namespace UMI_Robot {

    const PCA9685_ADD = 0x40
    const MODE1 = 0x00
    const MODE2 = 0x01
    const SUBADR1 = 0x02
    const SUBADR2 = 0x03
    const SUBADR3 = 0x04

    const LED0_ON_L = 0x06
    const LED0_ON_H = 0x07
    const LED0_OFF_L = 0x08
    const LED0_OFF_H = 0x09

    const ALL_LED_ON_L = 0xFA
    const ALL_LED_ON_H = 0xFB
    const ALL_LED_OFF_L = 0xFC
    const ALL_LED_OFF_H = 0xFD

    const PRESCALE = 0xFE

    let initialized = false

    export enum enLineState {
        //% blockId="White" block="white"
        White = 0,
        //% blockId="Black" block="black"
        Black = 1
    }
    
    
    export enum enServo {
        
        SERVO_1 = 15,
        SERVO_2 = 12,
        SERVO_3 = 13,
        SERVO_4 = 14
    }
    export enum enMotor {
        
        MOTOR_1A = 1,
        MOTOR_1B = 2,
        MOTOR_2A = 3,
        MOTOR_2B = 4
    }
    export enum MotorState {
        //% blockId="Motor_SpinLeft" block="Spin Left"
        Car_SpinLeft = 1,
        //% blockId="Motor_SpinRight" block="Spin Right"
        Car_SpinRight = 2
    }

    export enum Motor_State {
    	//% blockId="Motor_Stop" block="Stop"
        Car_Stop = 0,
        //% blockId="Motor_SpinLeft" block="Spin Left"
        Car_SpinLeft = 1,
        //% blockId="Motor_SpinRight" block="Spin Right"
        Car_SpinRight = 2
    }

    function i2cwrite(addr: number, reg: number, value: number) {
        let buf = pins.createBuffer(2)
        buf[0] = reg
        buf[1] = value
        pins.i2cWriteBuffer(addr, buf)
    }

    function i2ccmd(addr: number, value: number) {
        let buf = pins.createBuffer(1)
        buf[0] = value
        pins.i2cWriteBuffer(addr, buf)
    }

    function i2cread(addr: number, reg: number) {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
        return val;
    }

    function initPCA9685(): void {
        i2cwrite(PCA9685_ADD, MODE1, 0x00)
        setFreq(50);
        initialized = true
    }

    function setFreq(freq: number): void {
        // Constrain the frequency
        let prescaleval = 25000000;
        prescaleval /= 4096;
        prescaleval /= freq;
        prescaleval -= 1;
        let prescale = prescaleval; //Math.Floor(prescaleval + 0.5);
        let oldmode = i2cread(PCA9685_ADD, MODE1);
        let newmode = (oldmode & 0x7F) | 0x10; // sleep
        i2cwrite(PCA9685_ADD, MODE1, newmode); // go to sleep
        i2cwrite(PCA9685_ADD, PRESCALE, prescale); // set the prescaler
        i2cwrite(PCA9685_ADD, MODE1, oldmode);
        control.waitMicros(5000);
        i2cwrite(PCA9685_ADD, MODE1, oldmode | 0xa1);
    }

    function setPwm(channel: number, on: number, off: number): void {
        if (channel < 0 || channel > 15)
            return;
        if (!initialized) {
            initPCA9685();
        }
        let buf = pins.createBuffer(5);
        buf[0] = LED0_ON_L + 4 * channel;
        buf[1] = on & 0xff;
        buf[2] = (on >> 8) & 0xff;
        buf[3] = off & 0xff;
        buf[4] = (off >> 8) & 0xff;
        pins.i2cWriteBuffer(PCA9685_ADD, buf);
    }

    function Motor_run(motor: number, state: number, speed: number) {

        speed = speed * 16; // map 350 to 4096
        if (speed >= 4096) {
            speed = 4095
        }
        if (speed <= 350) {
            speed = 0
        }
        switch (motor) {
            case enMotor.MOTOR_1A: {
            	if (state == MotorState.Car_SpinLeft) {
            		setPwm(6, 0, 0);
        			setPwm(7, 0, speed);
            	}
            	if (state == MotorState.Car_SpinRight) {
            		setPwm(6, 0, speed);
        			setPwm(7, 0, 0);
            	}
            	if (state == Motor_State.Car_Stop) {
            		setPwm(6, 0, 0);
        			setPwm(7, 0, 0);
            	}
            	break;
            }
            case enMotor.MOTOR_2A: {
            	if (state == MotorState.Car_SpinLeft) {
            		setPwm(10, 0, 0);
        			setPwm(11, 0, speed);
            	}
            	if (state == MotorState.Car_SpinRight) {
            		setPwm(10, 0, speed);
        			setPwm(11, 0, 0);
            	}
            	if (state == Motor_State.Car_Stop) {
            		setPwm(10, 0, 0);
        			setPwm(11, 0, 0);
            	}
            	break;
            }
            case enMotor.MOTOR_1B: {
            	if (state == MotorState.Car_SpinLeft) {
            		setPwm(5, 0, 0);
        			setPwm(4, 0, speed);
            	}
            	if (state == MotorState.Car_SpinRight) {
            		setPwm(5, 0, speed);
        			setPwm(4, 0, 0);
            	}
            	if (state == Motor_State.Car_Stop) {
            		setPwm(5, 0, 0);
        			setPwm(4, 0, 0);
            	}
            	break;
            }
            case enMotor.MOTOR_2B: {
            	if (state == MotorState.Car_SpinLeft) {
            		setPwm(8, 0, 0);
        			setPwm(9, 0, speed);
            	}
            	if (state == MotorState.Car_SpinRight) {
            		setPwm(8, 0, speed);
        			setPwm(9, 0, 0);
            	}
            	if (state == Motor_State.Car_Stop) {
            		setPwm(8, 0, 0);
        			setPwm(9, 0, 0);
            	}
            	break;
            }
        }
    }

    //% blockId=mbit_MotorCtrl block="%motor %index"
    //% weight=4
    //% blockGap=10
    //% color="#006400"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=1
    //% expandableArgumentMode="enabled"
    export function MotorCtrl(motor: enMotor, index: Motor_State): void {
        Motor_run(motor, index, 255);
    }

    //% blockId=mbit_MotorCtrlSpeed block="%motor %index with speed %speed"
    //% weight=4
    //% blockGap=10
    //% speed.min=0 speed.max=255
    //% color="#006400"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=1
    //% expandableArgumentMode="enabled"
    export function MotorCtrlSpeed(motor: enMotor, index: MotorState, speed: number): void {
        Motor_run(motor, index, speed);
    }

    //% blockId=mbit_Servo_Car block="Set|%num|angle $value"
    //% weight=96
    //% blockGap=10
    //% color="#006400"
    //% num.min=1 num.max=3 value.min=0 value.max=180
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=9
    //% value.shadow="protractorPicker"
    export function Servo_Car(num: enServo, value: number): void {

        // 50hz: 20,000 us
        let us = (value * 1800 / 180 + 600); // 0.6 ~ 2.4
        let pwm = us * 4096 / 20000;
        setPwm(num, 0, pwm);

    }
}
