

// Samuel Niederer
// TCS34725 extension
const TCS34725_I2C_ADDRESS = 0x29        //I2C address of the TCS34725 (Page 34)

/* TCS34725 register addresses (Page 20)*/

const TCS34725_REGISTER_COMMAND = 0x80		// Specifies register address 


// Parameters for...
enum RGB {
    RED,
    GREEN,
    BLUE,
    CLEAR
}

// Parameters for setting the persistence register. The persistence register controls the filtering interrupt capabilities of the device.
enum TCS34725_APERS {
    APERS_0_CLEAR = 0b0000,      // Every RGBC cycle generates an interrupt
    APERS_1_CLEAR = 0b0001,      // 1 clear channel value outside of threshold range
    APERS_2_CLEAR = 0b0010,      // 2 clear channel consecutive values out of range
    APERS_3_CLEAR = 0b0011,      // 3 clear channel consecutive values out of range
    APERS_5_CLEAR = 0b0100,      // 5 clear channel consecutive values out of range
    APERS_10_CLEAR = 0b0101,     // 10 clear channel consecutive values out of range
    APERS_15_CLEAR = 0b0110,     // 15 clear channel consecutive values out of range
    APERS_20_CLEAR = 0b0111,     // 20 clear channel consecutive values out of range
    APERS_25_CLEAR = 0b1000,     // 25 clear channel consecutive values out of range
    APERS_30_CLEAR = 0b1001,     // 30 clear channel consecutive values out of range
    APERS_35_CLEAR = 0b1010,     // 35 clear channel consecutive values out of range
    APERS_40_CLEAR = 0b1011,     // 40 clear channel consecutive values out of range
    APERS_45_CLEAR = 0b1100,     // 45 clear channel consecutive values out of range
    APERS_50_CLEAR = 0b1101,     // 50 clear channel consecutive values out of range
    APERS_55_CLEAR = 0b1110,     // 55 clear channel consecutive values out of range
    APERS_60_CLEAR = 0b1111,     // 60 clear channel consecutive values out of range
}


// { 
//     GAIN_1X = 0x0,      // 1x gain
//     GAIN_4X = 0x1,      // 4x gain
//     GAIN_16X = 0x2,      // 16x gain
//     GAIN_60X = 0x3       // 60x gain
// }


/* Gesture sensor */

enum DIR {
    DIR_NONE,
    DIR_LEFT,
    DIR_RIGHT,
    DIR_UP,
    DIR_DOWN,
    DIR_NEAR,
    DIR_FAR,
    DIR_ALL
}
enum STATE {
    NA_STATE,
    NEAR_STATE,
    FAR_STATE,
    ALL_STATE
}
enum GESTURE_TYPE {
    //% block=无
    None = 0,
    //% block=向下
    Right = 1,
    //% block=向上
    Left = 2,
    //% block=向右
    Up = 3,
    //% block=向左
    Down = 4,
    //% block=向前
    Forward = 5,
    //% block=向后
    Backward = 6
}

enum Mode {
    //% block="LOOP"
    LOOP_MODE = 0,        // 循环模式
    //% block="BUTTON"
    BUTTON_MODE = 1,      // 按键模式
    //% block="KEYWORDS"
    KEYWORDS_MODE = 2,    // 唤醒词模式
    //% block="KEYWORDS_AND"
    KEYWORDS_AND_BUTTON = 3, // 唤醒词加按键模式
}

enum times {
    //% block=年
    time1 = 0,
    //% block=月
    time2 = 1,
    //% block=日
    time3 = 2,
    //% block=时
    time4 = 3,
    //% block=分
    time5 = 4,
    //% block=秒
    time6 = 5,
}

//% weight=20 color=#0855AA icon="O" block="Smart module"
namespace SmartModule {

    let VOICE_RESET_REG = 0x5;
    let VOICE_IIC_ADDR = 0x79;
    let VOICE_ADD_WORDS_REG = 0x04;
    let VOICE_ASR_START_REG = 0x6;
    let VOICE_RESULT_REG = 0;
    let VOICE_CONFIG_TIME_REG = 0x3;

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
    
    function i2cwrite(addr: number, reg: number, value: number) {
        let buf = pins.createBuffer(2)
        buf[0] = reg
        buf[1] = value
        pins.i2cWriteBuffer(addr, buf)
    }
    //% blockId="Speech_recognition_reset" block="Voice recognition module for reset"  group="语音识别模块"
    //% subcategory="智能模块"
    //% inlineInputMode=inline
     //% weight=100
     export function Speech_recognition_reset(): void {
        i2ccmd(VOICE_IIC_ADDR,VOICE_RESET_REG)
        basic.pause(300)
    }
    
    //% blockId="Speech_recognition_start" block="Voice recognition starts to recognize"  group="语音识别模块"
    //% subcategory="智能模块"
    //% inlineInputMode=inline
    //% weight=99
    export function Speech_recognition_start(): void {
        i2ccmd(VOICE_IIC_ADDR,VOICE_ASR_START_REG)
        basic.pause(300)
    }

    //% blockId="Speech_recognition_mode" block="The voice recognition mode is set to %Mode"  group="语音识别模块"
    //% subcategory="智能模块"
    //% inlineInputMode=inline
    //% weight=98
    export function Speech_recognition_mode(Mode : Mode): void {
        i2cwrite(VOICE_IIC_ADDR,VOICE_RESET_REG,Mode)
        basic.pause(300)
    }

    /**
     * speed recognition glossary. 
     * @param word_number is the word number,eg: 1
     * 
    */
    //% blockId="Speech_recognition_glossary" block="Voice recognition to set the word number %word_number|Word content %word_content"  group="语音识别模块"
    //% subcategory="智能模块"
    //% inlineInputMode=inline
    //% weight=95
    export function Speech_recognition_glossary(word_number : number, word_content : string): void {
        i2cwriteContent(VOICE_IIC_ADDR, VOICE_ADD_WORDS_REG, word_number,word_content)
        basic.pause(300)
    }

    //% blockId="Speech_recognition_get_result" block="Speech recognition to get the corresponding number of the recognized words"   group="语音识别模块"
    //% subcategory="智能模块"
    //% inlineInputMode=inline
    //% weight=96
    export function Speech_recognition_get_result(): number {
        let result =i2cread(VOICE_IIC_ADDR,VOICE_RESULT_REG)
        return result;
     }

    //% blockId="Speech_config_keyword" block="Voice recognition module set wake-up keywords %word_content"  group="语音识别模块"
    //% subcategory="智能模块"
    //% inlineInputMode=inline
    //% weight=95
    export function Speech_config_keyword(word_content : string): void {
        i2cwriteContent(VOICE_IIC_ADDR, VOICE_ADD_WORDS_REG, 0, word_content)
        basic.pause(300)
    }
    
    /**
     * speed recognition time. 
     * @param time is the key word config time,eg: 10
     * 
    */
    //% blockId="Speech_recognition_time" block="Voice recognition to set wake-up time %time"  group="语音识别模块"
    //% subcategory="智能模块"
    //% inlineInputMode=inline
    //% weight=97
    export function Speech_recognition_time(time : number): void {
        i2cwrite(VOICE_IIC_ADDR,VOICE_CONFIG_TIME_REG,time)
        basic.pause(300)
    }

    function i2cwriteContent(addr: number, reg: number, value: number ,value1: string) {
        let lengths = value1.length
        let buf = pins.createBuffer(2+lengths)
        //let arr = value1.split('')
        buf[0] = reg 
        buf[1] = value
        let bytes = []
        bytes = stringToBytes(value1)
        for (let i = 0; i < bytes.length; i++) {
            buf[2+i] = bytes[i]
        }
        pins.i2cWriteBuffer(addr, buf)
    }

    function stringToBytes (str : string) {  
        let ch = 0;
        let st = 0;
        let gm:number[]; 
        gm = [];
        for (let i = 0; i < str.length; i++ ) { 
            ch = str.charCodeAt(i);  
            st = 0 ;                 
           do {  
                st = ( ch & 0xFF );  
                ch = ch >> 8;   
                gm.push(st);        
            }    
            while ( ch );  
        }  
        return gm;  
    } 



    let DS1302_REG_SECOND = 0x80
    let DS1302_REG_MINUTE = 0x82
    let DS1302_REG_HOUR = 0x84
    let DS1302_REG_DAY = 0x86
    let DS1302_REG_MONTH = 0x88
    let DS1302_REG_YEAR = 0x8C
    let DS1302_REG_WP = 0x8E


    let tys = 0;
    let tms = 0;
    let tds = 0;
    let th = 0;
    let tm = 0;
    let ts = 0;
    let btns = 0;
    let looks = 0;


    /**
     * convert a Hex data to Dec
     */
    function HexToDec(dat: number): number {
        return (dat >> 4) * 10 + (dat % 16);
    }

    /**
     * convert a Dec data to Hex
     */
    function DecToHex(dat: number): number {
        return Math.idiv(dat, 10) * 16 + (dat % 10)
    }

    let ds1302CLK: DigitalPin;
    let ds1302DIO: DigitalPin;
    let ds1302CS: DigitalPin;

    /**
     * DS1302CLOCK RTC class
     */
    // export class DS1302RTC {
    //     clk: DigitalPin;
    //     dio: DigitalPin;
    //     cs: DigitalPin;

        /**
         * write a byte to DS1302CLOCK
         */
        function write_byte(dat: number) {
            for (let i = 0; i < 8; i++) {
                pins.digitalWritePin(ds1302DIO, (dat >> i) & 1);
                pins.digitalWritePin(ds1302CLK, 1);
                pins.digitalWritePin(ds1302CS, 0);
            }
        }

        /**
         * read a byte from DS1302CLOCK
         */
         function read_byte(): number {
            let d = 0;
            for (let i = 0; i < 8; i++) {
                d = d | (pins.digitalReadPin(ds1302DIO) << i);
                pins.digitalWritePin(ds1302CLK, 1);
                pins.digitalWritePin(ds1302CLK, 0);
            }
            return d;
        }

        /**
         * read reg
         */
        function getReg(reg: number): number {
            let t = 0;
            pins.digitalWritePin(ds1302CS, 1);
            write_byte(reg);
            t = read_byte();
            pins.digitalWritePin(ds1302CS, 0);
            return t;
        }

        /**
         * write reg
         */
         function setReg(reg: number, dat: number) {
            pins.digitalWritePin(ds1302CS, 1);
            write_byte(reg);
            write_byte(dat);
            pins.digitalWritePin(ds1302CS, 0);
        }

        /**
         * write reg with WP protect
         */
        function wr(reg: number, dat: number) {
            setReg(DS1302_REG_WP, 0)
            setReg(reg, dat)
            setReg(DS1302_REG_WP, 0)
        }


        /**
         * get Year
         */
        //% blockId=DS1302_get_year block="DS1302时钟模块获取 %TIME" group="DS1302时钟模块"
        //% weight=80 blockGap=8
        //% subcategory="智能模块"
        export function getYear(TIME: times): number {
            if (btns == 1) {
                ts = Math.min(HexToDec(getReg(DS1302_REG_SECOND + 1)), 59)
                wr(DS1302_REG_SECOND, DecToHex(ts & 0x7f % 60));
                setYear(tys, tms, tds);
                setHour(th, tm, ts);
                switch (TIME) {
                    case 0:
                        looks = tys;
                        return looks;
                    // return Math.min(HexToDec(this.getReg(DS1302_REG_YEAR + 1)), 99) + 2000;
                    case 1:
                        looks = tms;
                        return looks;
                    // return Math.max(Math.min(HexToDec(this.getReg(DS1302_REG_MONTH + 1)), 12), 1);
                    case 2:
                        looks = tds;
                        return looks;
                    // return Math.max(Math.min(HexToDec(this.getReg(DS1302_REG_DAY + 1)), 31), 1);
                    case 3:
                        looks = th;
                        return looks;
                    // return Math.min(HexToDec(this.getReg(DS1302_REG_HOUR + 1)), 23);
                    case 4:
                        looks = tm;
                        return looks;
                    // return Math.min(HexToDec(this.getReg(DS1302_REG_MINUTE + 1)), 59);
                    default:
                        // return Math.min(HexToDec(this.getReg(DS1302_REG_SECOND + 1)), 59);
                        looks = ts;
                        return looks;
                }
            } else {
                switch (TIME) {
                    case 0:
                        setYear(looks, tms, tds)
                    // return Math.min(HexToDec(this.getReg(DS1302_REG_YEAR + 1)), 99) + 2000;
                    case 1:
                        setYear(tys, looks, tds)
                    // return Math.max(Math.min(HexToDec(this.getReg(DS1302_REG_MONTH + 1)), 12), 1);
                    case 2:
                        setYear(tys, tms, looks)
                    // return Math.max(Math.min(HexToDec(this.getReg(DS1302_REG_DAY + 1)), 31), 1);
                    case 3:
                        setHour(looks, tm, ts)
                    // return Math.min(HexToDec(this.getReg(DS1302_REG_HOUR + 1)), 23);
                    case 4:
                        setHour(th, looks, ts)
                    // return Math.min(HexToDec(this.getReg(DS1302_REG_MINUTE + 1)), 59);
                    default:
                        // return Math.min(HexToDec(this.getReg(DS1302_REG_SECOND + 1)), 59);
                        setHour(th, tm, looks)
                }
                return looks;
            }
        }
        //     if(btns == 1) {

        // } ts = Math.min(HexToDec(this.getReg(DS1302_REG_SECOND + 1)), 59)
        // this.wr(DS1302_REG_SECOND, DecToHex(ts & 0x7f % 60));
        // this.setYear(tys, tms, tds);
        // this.setHour(th, tm, ts);
        /**
         * set year
         * @param dat is the Year will be set, eg: 2018
         */
        //% blockId=DS1302_set_year block="DS1302时钟模块设置 年 %year 月 %mon 日 %days" group="DS1302时钟模块"
        //% weight=81 blockGap=8
        //% mon.min=1 mon.max=12
        //% days.min=1 days.max=31
        //% subcategory="智能模块"
        export function setYear(year: number, mon: number, days: number): void {
            tys = year;
            tms = mon;
            tds = days;
            wr(DS1302_REG_YEAR, DecToHex(year % 100));
            wr(DS1302_REG_MONTH, DecToHex(mon % 13));
            wr(DS1302_REG_DAY, DecToHex(days % 32))
        }

        /**
         * set hour
         * @param dat is the Hour will be set, eg: 0
         */
        //% blockId=DS1302_set_hour block="DS1302时钟模块设置时 %hour set 分 %minu 秒 %sec" group="DS1302时钟模块"
        //% weight=73 blockGap=8
        //% hour.min=0 dat.max=23
        //% minu.min=0 minu.max=59
        //% sec.min=0 sec.max=59
        //% subcategory="智能模块"
        export function setHour(hour: number, minu: number, sec: number): void {
            th = hour;
            tm = minu;
            ts = sec;
            wr(DS1302_REG_HOUR, DecToHex(hour % 24));
            wr(DS1302_REG_MINUTE, DecToHex(minu % 60));
            wr(DS1302_REG_SECOND, DecToHex(sec % 60));
        }



        /**
         * start DS1302CLOCK RTC (go on)
         */
        //% blockId=DS1302_start block="DS1302时钟模块开始" group="DS1302时钟模块"
        //% weight=41 blockGap=8
        //% subcategory="智能模块"
        export function ds1302Start() {
            btns = 1;
        }

        /**
         * pause DS1302CLOCK RTC
         */
        //% blockId=DS1302_pause block="DS1302时钟模块暂停" group="DS1302时钟模块"
        //% weight=40 blockGap=8
        //% subcategory="智能模块"
        export function pause() {
            btns = 0;
        }

    // }

    /**
     * create a DS1302CLOCK object.
     * @param clk the CLK pin for DS1302CLOCK, eg: DigitalPin.P13
     * @param dio the DIO pin for DS1302CLOCK, eg: DigitalPin.P14
     * @param cs the CS pin for DS1302CLOCK, eg: DigitalPin.P15
     */
    //% weight=200 blockGap=8
    //% blockId=DS1302_create block="初始化DS1302时钟模块 引脚CLK %clk|DIO %dio|CS %cs" group="DS1302时钟模块"
    //% subcategory="智能模块"
    export function create(clk: DigitalPin, dio: DigitalPin, cs: DigitalPin): void {
        // let ds = new DS1302RTC();
        ds1302CLK = clk;
        ds1302DIO = dio;
        ds1302CS = cs;
        pins.digitalWritePin(ds1302CLK, 0);
        pins.digitalWritePin(ds1302CS, 0);
        // return ds;
    }








    let TCS34725_I2C_ADDR = TCS34725_I2C_ADDRESS;
    export let isConnected = false;
    let atimeIntegrationValue = 0;
    let gainSensorValue = 0

    /**
    * Write register of the address location
    */
    export function writeRegister(addr: number, reg: number, dat: number): void {
        let _registerBuffer = pins.createBuffer(2);
        _registerBuffer[0] = reg;
        _registerBuffer[1] = dat;
        pins.i2cWriteBuffer(addr, _registerBuffer);
    }

    /**
     * Read a 8-byte register of the address location
     */
    export function readRegister8(addr: number, reg: number): number {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
    }

    /**
     * Read a (UInt16) 16-byte register of the address location
     */
    export function readRegisterUInt16(addr: number, reg: number): number {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(addr, NumberFormat.UInt16LE);
    }

    /**
     * Read a (Int16) 16-byte register of the address location
     */
    export function readRegisterInt16(addr: number, reg: number): number {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(addr, NumberFormat.Int16LE);
    }


    export function initSensor() {
        //REGISTER FORMAT:   CMD | TRANSACTION | ADDRESS
        //REGISTER READ:     TCS34725_REGISTER_COMMAND (0x80) | 0x12 (0x12)
        let device_id = readRegister8(TCS34725_I2C_ADDRESS, TCS34725_REGISTER_COMMAND | 0x12)

        //Check that device Identification has one of 2 i2c addresses         
        if ((device_id != 0x44) && (device_id != 0x10)) {
            isConnected = false;
        }
        else
            isConnected = true;
    }

    export function turnSensorOn(TCS34725_ATIME: number) {

        //REGISTER FORMAT:   CMD | TRANSACTION | ADDRESS
        //REGISTER VALUE:    TCS34725_REGISTER_COMMAND (0x80) | 0x00 (0x00)
        //REGISTER WRITE:    0x01 (0x01)
        writeRegister(TCS34725_I2C_ADDR, TCS34725_REGISTER_COMMAND | 0x00, 0x01);
        basic.pause(300);


        //REGISTER FORMAT:   CMD | TRANSACTION | ADDRESS
        //REGISTER VALUE:    TCS34725_REGISTER_COMMAND (0x80) | 0x00 (0x00)
        //REGISTER WRITE:    0x01 (0x01) | 0x02 (0x02)        
        writeRegister(TCS34725_I2C_ADDR, TCS34725_REGISTER_COMMAND | 0x00, 0x01 | 0x02);

        pauseSensorForIntegrationTime(TCS34725_ATIME);
    }

    export function pauseSensorForIntegrationTime(TCS34725_ATIME: number) {
        switch (TCS34725_ATIME) {
            case TCS34725_ATIME: {
                basic.pause(50);
                break;
            }
        }
    }

    export function turnSensorOff() {
        //REGISTER FORMAT:   CMD | TRANSACTION | ADDRESS
        //REGISTER READ:     TCS34725_REGISTER_COMMAND (0x80) | 0x12 (0x12)        
        let sensorReg = readRegister8(TCS34725_I2C_ADDR, TCS34725_REGISTER_COMMAND | 0x00);

        //REGISTER FORMAT:   CMD | TRANSACTION | ADDRESS
        //REGISTER VALUE:    TCS34725_REGISTER_COMMAND (0x80) | 0x00 (0x00)
        //REGISTER WRITE:    sensorReg & ~(0x01 (0x01) | 0x02 (0x02))            
        writeRegister(TCS34725_I2C_ADDR, TCS34725_REGISTER_COMMAND | 0x00, sensorReg & ~(0x01 | 0x02));
    }

    export function setATIMEintegration(TCS34725_ATIME: number) {
        //Always make sure the color sensor is connected. Useful for cases when this block is used but the sensor wasn't set randomly. 
        if (!isConnected)
            initSensor()

        //REGISTER FORMAT:   CMD | TRANSACTION | ADDRESS
        //REGISTER VALUE:    TCS34725_REGISTER_COMMAND (0x80) | 0x01 (0x01)
        //REGISTER WRITE:    TCS34725_ATIME                
        writeRegister(TCS34725_I2C_ADDR, TCS34725_REGISTER_COMMAND | 0x01, TCS34725_ATIME)

        atimeIntegrationValue = TCS34725_ATIME;

    }

    export function setGAINsensor(TCS34725_AGAIN: number) {
        //Always make sure the color sensor is connected. Useful for cases when this block is used but the sensor wasn't set randomly. 
        if (!isConnected)
            initSensor()

        //REGISTER FORMAT:   CMD | TRANSACTION | ADDRESS
        //REGISTER VALUE:    TCS34725_REGISTER_COMMAND (0x80) | 0x0F (0x0F)
        //REGISTER WRITE:    TCS34725_AGAIN         
        writeRegister(TCS34725_I2C_ADDR, TCS34725_REGISTER_COMMAND | 0x0F, TCS34725_AGAIN)

        gainSensorValue = TCS34725_AGAIN;
    }

    export function start(TCS34725_ATIME: number, TCS34725_AGAIN: number) {

        while (!isConnected) {
            initSensor();
        }

        setATIMEintegration(TCS34725_ATIME);
        setGAINsensor(TCS34725_AGAIN);
        turnSensorOn(TCS34725_ATIME);
    }

    export type RGBC = {
        red: number,
        green: number,
        blue: number,
        clear: number
    };

    export function getSensorRGB(): RGBC {
        //Always check that sensor is/was turned on
        while (!isConnected) {
            initSensor();
        }

        //REGISTER FORMAT:   CMD | TRANSACTION | ADDRESS
        //REGISTER READ:     TCS34725_REGISTER_COMMAND (0x80) | 0x16 (0x16)          
        let redColorValue = readRegisterUInt16(TCS34725_I2C_ADDR, TCS34725_REGISTER_COMMAND | 0x16);

        //REGISTER FORMAT:   CMD | TRANSACTION | ADDRESS
        //REGISTER READ:     TCS34725_REGISTER_COMMAND (0x80) | 0x18 (0x18)          
        let greenColorValue = readRegisterUInt16(TCS34725_I2C_ADDR, TCS34725_REGISTER_COMMAND | 0x18);

        //REGISTER FORMAT:   CMD | TRANSACTION | ADDRESS
        //REGISTER READ:     TCS34725_REGISTER_COMMAND (0x80) | 0x1A (0x1A)          
        let blueColorValue = readRegisterUInt16(TCS34725_I2C_ADDR, TCS34725_REGISTER_COMMAND | 0x1A);

        //REGISTER FORMAT:   CMD | TRANSACTION | ADDRESS
        //REGISTER READ:     TCS34725_REGISTER_COMMAND (0x80) | 0x14 (0x14)          
        let clearColorValue = readRegisterUInt16(TCS34725_I2C_ADDR, TCS34725_REGISTER_COMMAND | 0x14);

        pauseSensorForIntegrationTime(atimeIntegrationValue);

        let sum = clearColorValue;
        let r = 0;
        let g = 0;
        let b = 0;

        if (clearColorValue == 0) {
            return {
                red: 0,
                green: 0,
                blue: 0,
                clear: 0
            }
        }
        else {
            r = redColorValue / sum * 255;
            g = greenColorValue / sum * 255;
            b = blueColorValue / sum * 255;

            return {
                red: r,
                green: g,
                blue: b,
                clear: clearColorValue
            }
        }
    }
    //% blockId=getSensorData block="Get color data %colorId" group="颜色传感器"
    export function getSensorData(colorId: RGB): number {
        start(0xF6, 0x1);
        let data = getSensorRGB();
        let color = 0;
        switch (colorId) {
            case RGB.RED: color = data.red;
                break;
            case RGB.GREEN: color = data.green;
                break;
            case RGB.BLUE: color = data.blue;
                break;
            case RGB.CLEAR: color = data.clear;
                break;
        }

        return color;
    }



    /* Gesture parameters */
    let GESTURE_THRESHOLD_OUT = 30;
    let GESTURE_SENSITIVITY_1 = 33
    let GESTURE_SENSITIVITY_2 = 18

    /* Error code for returned values */
    //ERROR = 0xFF

    /* Acceptable parameters for setMode */
    let POWER = 0
    let PROXIMITY = 2
    let WAIT = 3
    let GESTURE = 6
    let ALL = 7

    /* LED Drive values */
    let LED_DRIVE_100MA = 0

    /* Gesture Gain (GGAIN) values */
    let GGAIN_4X = 2

    /* LED Boost values */
    let LED_BOOST_300 = 3

    /* Gesture wait time values */
    let GWTIME_2_8MS = 1


    /* Default values */
    let DEFAULT_GESTURE_PPULSE = 0x89    // 16us, 10 pulses
    let DEFAULT_GPENTH = 40      // Threshold for entering gesture mode
    let DEFAULT_GEXTH = 30      // Threshold for exiting gesture mode    
    let DEFAULT_GCONF1 = 0x40    // 4 gesture events for int., 1 for exit
    let DEFAULT_GGAIN = GGAIN_4X
    let DEFAULT_GLDRIVE = LED_DRIVE_100MA
    let DEFAULT_GWTIME = GWTIME_2_8MS
    let DEFAULT_GOFFSET = 0       // No offset scaling for gesture mode
    let DEFAULT_GPULSE = 0xC9    // 32us, 10 pulses
    let DEFAULT_GCONF3 = 0       // All photodiodes active during gesture
    let DEFAULT_GIEN = 0       // Disable gesture interrupts

    /* APDS-9960 I2C address:0x39 */




    /* Container for gesture data */
    export class gesture_data_type {
        u_data: Buffer;
        d_data: Buffer;
        l_data: Buffer;
        r_data: Buffer;
        index: number;
        total_gestures: number;
        in_threshold: number;
        out_threshold: number;
    }

    let gesture_data = new gesture_data_type;

    let data_buf: Buffer = pins.createBuffer(128);

    export class APDS9960 {



        gesture_ud_delta: number;
        gesture_lr_delta: number;
        gesture_ud_count: number;
        gesture_lr_count: number;
        gesture_near_count: number;
        gesture_far_count: number;
        gesture_state: number;
        gesture_motion: number;

        APDS9960ReadReg(addr: number): number {
            let buf: Buffer = pins.createBuffer(1);
            buf[0] = addr;
            pins.i2cWriteBuffer(0x39, buf, false);
            buf = pins.i2cReadBuffer(0x39, 1, false);
            return buf[0];
        }

        APDS9960WriteReg(addr: number, cmd: number) {
            let buf2: Buffer = pins.createBuffer(2);

            buf2[0] = addr;
            buf2[1] = cmd;

            pins.i2cWriteBuffer(0x39, buf2, false);
        }


        /**
         * @brief Reads a block (array) of bytes from the I2C device and register
         *
         * @param[in] reg the register to read from
         * @param[out] val pointer to the beginning of the data
         * @param[in] len number of bytes to read
         * @return Number of bytes read. -1 on read error.
         */
        APDS9960ReadRegBlock(addr: number, len: number): number {
            let i: number = 0;
            let y: number = 0;

            for (let j = 0; j < len; j = j + 4) {

                data_buf[j] = this.readi2c(0xFc);
                data_buf[j + 1] = this.readi2c(0xFd);
                data_buf[j + 2] = this.readi2c(0xFe);
                data_buf[j + 3] = this.readi2c(0xFf);
                basic.pause(10);

            }


            return len;
        }

        getMode(): number {
            let enable_value: number;

            /* Read current ENABLE register */
            enable_value = this.APDS9960ReadReg(0x80);
            return enable_value;
        }

        setMode(mode: number, enable: number) {
            let reg_val: number;
            /* Read current ENABLE register */
            reg_val = this.getMode();
            /* Change bit(s) in ENABLE register */
            enable = enable & 0x01;
            if (mode >= 0 && mode <= 6) {
                if (enable) {
                    reg_val |= (1 << mode);
                } else {
                    //reg_val &= ~(1 << mode);
                    reg_val = 0x00;
                }
            } else if (mode == ALL) {
                if (enable) {
                    reg_val = 0x7F;
                } else {
                    reg_val = 0x00;
                }
            }

            /* Write value back to ENABLE register */
            this.APDS9960WriteReg(0x80, reg_val);
        }

        /**
         * @brief Sets the gain of the photodiode during gesture mode
         *
         * Value    Gain
         *   0       1x
         *   1       2x
         *   2       4x
         *   3       8x
         *
         * @param[in] gain the value for the photodiode gain
         * @return True if operation successful. False otherwise.
         */
        setGestureGain(gain: number) {
            let val: number;

            /* Read value from GCONF2 register */
            val = this.APDS9960ReadReg(0xA3);

            /* Set bits in register to given value */
            gain &= 0b00000011;
            gain = gain << 5;
            val &= 0b10011111;
            val |= gain;

            /* Write register value back into GCONF2 register */
            this.APDS9960WriteReg(0xA3, val);
        }

        /**
         * @brief Sets the LED drive current during gesture mode
         *
         * Value    LED Current
         *   0        100 mA
         *   1         50 mA
         *   2         25 mA
         *   3         12.5 mA
         *
         * @param[in] drive the value for the LED drive current
         * @return True if operation successful. False otherwise.
         */
        setGestureLEDDrive(drive: number) {
            let val2: number;

            /* Read value from GCONF2 register */
            val2 = this.APDS9960ReadReg(0xA3);

            /* Set bits in register to given value */
            drive &= 0b00000011;
            drive = drive << 3;
            val2 &= 0b11100111;
            val2 |= drive;

            /* Write register value back into GCONF2 register */
            this.APDS9960WriteReg(0xA3, val2);
        }

        /**
         * @brief Sets the LED current boost value
         *
         * Value  Boost Current
         *   0        100%
         *   1        150%
         *   2        200%
         *   3        300%
         *
         * @param[in] drive the value (0-3) for current boost (100-300%)
         * @return True if operation successful. False otherwise.
         */
        setLEDBoost(boost: number) {
            let val3: number;

            /* Read value from CONFIG2 register */
            val3 = this.APDS9960ReadReg(0x90);

            /* Set bits in register to given value */
            boost &= 0b00000011;
            boost = boost << 4;
            val3 &= 0b11001111;
            val3 |= boost;

            /* Write register value back into CONFIG2 register */
            this.APDS9960WriteReg(0x90, val3);
        }

        /**
         * @brief Sets the time in low power mode between gesture detections
         *
         * Value    Wait time
         *   0          0 ms
         *   1          2.8 ms
         *   2          5.6 ms
         *   3          8.4 ms
         *   4         14.0 ms
         *   5         22.4 ms
         *   6         30.8 ms
         *   7         39.2 ms
         *
         * @param[in] the value for the wait time
         * @return True if operation successful. False otherwise.
         */
        setGestureWaitTime(time: number) {
            let val4: number;

            /* Read value from GCONF2 register */
            val4 = this.APDS9960ReadReg(0xA3);

            /* Set bits in register to given value */
            time &= 0b00000111;
            val4 &= 0b11111000;
            val4 |= time;

            /* Write register value back into GCONF2 register */
            this.APDS9960WriteReg(0xA3, val4);
        }

        /**
         * @brief Turns gesture-related interrupts on or off
         *
         * @param[in] enable 1 to enable interrupts, 0 to turn them off
         * @return True if operation successful. False otherwise.
         */
        setGestureIntEnable(enable: number) {
            let val5: number;

            /* Read value from GCONF4 register */
            val5 = this.APDS9960ReadReg(0xAB);

            /* Set bits in register to given value */
            enable &= 0b00000001;
            enable = enable << 1;
            val5 &= 0b11111101;
            val5 |= enable;

            /* Write register value back into GCONF4 register */
            this.APDS9960WriteReg(0xAB, val5);
        }

        /**
         * @brief Resets all the parameters in the gesture data member
         */
        resetGestureParameters() {

            gesture_data.index = 0;
            gesture_data.total_gestures = 0;

            this.gesture_ud_delta = 0;
            this.gesture_lr_delta = 0;

            this.gesture_ud_count = 0;
            this.gesture_lr_count = 0;

            this.gesture_near_count = 0;
            this.gesture_far_count = 0;

            this.gesture_state = 0;
            this.gesture_motion = DIR.DIR_NONE;

        }

        /**
         * @brief Tells the state machine to either enter or exit gesture state machine
         *
         * @param[in] mode 1 to enter gesture state machine, 0 to exit.
         * @return True if operation successful. False otherwise.
         */
        setGestureMode(mode: number) {
            let val6: number;

            /* Read value from GCONF4 register */
            val6 = this.APDS9960ReadReg(0xAB);

            /* Set bits in register to given value */
            mode &= 0b00000001;
            val6 &= 0b11111110;
            val6 |= mode;

            /* Write register value back into GCONF4 register */
            this.APDS9960WriteReg(0xAB, val6);
        }

        /**
         * Turn the APDS-9960 on
         *
         * @return True if operation successful. False otherwise.
         */
        enablePower() {
            this.setMode(POWER, 1);
        }

        /**
         * @brief Starts the gesture recognition engine on the APDS-9960
         *
         * @param[in] interrupts true to enable hardware external interrupt on gesture
         * @return True if engine enabled correctly. False on error.
         */
        enableGestureSensor(interrupts: boolean) {

            /* Enable gesture mode
            Set ENABLE to 0 (power off)
            Set WTIME to 0xFF
            Set AUX to LED_BOOST_300
            Enable PON, WEN, PEN, GEN in ENABLE 
            */
            this.resetGestureParameters();
            this.APDS9960WriteReg(0x83, 0xFF);
            this.APDS9960WriteReg(0x8E, DEFAULT_GESTURE_PPULSE);
            this.setLEDBoost(LED_BOOST_300);
            if (interrupts) {
                this.setGestureIntEnable(1);
            } else {
                this.setGestureIntEnable(0);
            }
            this.setGestureMode(1);
            this.enablePower();
            this.setMode(WAIT, 1)
            this.setMode(PROXIMITY, 1);
            this.setMode(GESTURE, 1);
        }

        pads9960_init() {

            let aa = this.APDS9960ReadReg(0X92);
            if (aa == 0xAB) {
                this.APDS9960WriteReg(0xA0, DEFAULT_GPENTH);//0x28
                this.APDS9960WriteReg(0xA1, DEFAULT_GEXTH);//0x1e
                this.APDS9960WriteReg(0xA2, DEFAULT_GCONF1);//0x40
                this.setGestureGain(DEFAULT_GGAIN);//0x41
                this.setGestureLEDDrive(DEFAULT_GLDRIVE);
                this.setGestureWaitTime(DEFAULT_GWTIME);
                this.APDS9960WriteReg(0xA4, DEFAULT_GOFFSET);
                this.APDS9960WriteReg(0xA5, DEFAULT_GOFFSET);
                this.APDS9960WriteReg(0xA7, DEFAULT_GOFFSET);
                this.APDS9960WriteReg(0xA9, DEFAULT_GOFFSET);
                this.APDS9960WriteReg(0xA6, DEFAULT_GPULSE);//0xc9
                this.APDS9960WriteReg(0xAA, DEFAULT_GCONF3);//00
                this.setGestureIntEnable(DEFAULT_GIEN);
            }


        }

        /**
         * @brief Determines if there is a gesture available for reading
         *
         * @return True if gesture available. False otherwise.
         */
        isGestureAvailable(): boolean {
            let val8: number;

            /* Read value from GSTATUS register */
            val8 = this.APDS9960ReadReg(0xAF);
            /* Shift and mask out GVALID bit */
            val8 &= 0b00000001;

            /* Return true/false based on GVALID bit */
            if (val8 == 1) {
                return true;
            } else {
                return false;
            }
        }

        /**
         * @brief Processes the raw gesture data to determine swipe direction
         *
         * @return True if near or far state seen. False otherwise.
         */
        processGestureData(): boolean {
            let u_first: number = 0;
            let d_first: number = 0;
            let l_first: number = 0;
            let r_first: number = 0;
            let u_last: number = 0;
            let d_last: number = 0;
            let l_last: number = 0;
            let r_last: number = 0;
            let ud_ratio_first: number;
            let lr_ratio_first: number;
            let ud_ratio_last: number;
            let lr_ratio_last: number;
            let ud_delta: number;
            let lr_delta: number;
            let k: number;

            /* If we have less than 4 total gestures, that's not enough */
            if (gesture_data.total_gestures <= 4) {
                return false;
            }

            /* Check to make sure our data isn't out of bounds */
            if ((gesture_data.total_gestures <= 32) && (gesture_data.total_gestures > 0)) {

                /* Find the first value in U/D/L/R above the threshold */
                for (k = 0; k < gesture_data.total_gestures; k++) {
                    if ((gesture_data.u_data[k] > GESTURE_THRESHOLD_OUT) &&
                        (gesture_data.d_data[k] > GESTURE_THRESHOLD_OUT) &&
                        (gesture_data.l_data[k] > GESTURE_THRESHOLD_OUT) &&
                        (gesture_data.r_data[k] > GESTURE_THRESHOLD_OUT)) {

                        u_first = gesture_data.u_data[k];
                        d_first = gesture_data.d_data[k];
                        l_first = gesture_data.l_data[k];
                        r_first = gesture_data.r_data[k];
                        break;
                    }
                }

                /* If one of the _first values is 0, then there is no good data */
                if ((u_first == 0) || (d_first == 0) || (l_first == 0) || (r_first == 0)) {

                    return false;
                }
                /* Find the last value in U/D/L/R above the threshold */
                for (k = gesture_data.total_gestures - 1; k >= 0; k--) {


                    if ((gesture_data.u_data[k] > GESTURE_THRESHOLD_OUT) &&
                        (gesture_data.d_data[k] > GESTURE_THRESHOLD_OUT) &&
                        (gesture_data.l_data[k] > GESTURE_THRESHOLD_OUT) &&
                        (gesture_data.r_data[k] > GESTURE_THRESHOLD_OUT)) {

                        u_last = gesture_data.u_data[k];
                        d_last = gesture_data.d_data[k];
                        l_last = gesture_data.l_data[k];
                        r_last = gesture_data.r_data[k];
                        break;
                    }
                }
            }

            /* Calculate the first vs. last ratio of up/down and left/right */
            ud_ratio_first = ((u_first - d_first) * 100) / (u_first + d_first);
            lr_ratio_first = ((l_first - r_first) * 100) / (l_first + r_first);
            ud_ratio_last = ((u_last - d_last) * 100) / (u_last + d_last);
            lr_ratio_last = ((l_last - r_last) * 100) / (l_last + r_last);
            if (ud_ratio_first == 0 && lr_ratio_first == 0 && ud_ratio_last == 0 && lr_ratio_last == 0) {

                this.pads9960_init();
                this.enableGestureSensor(false);
            }


            /* Determine the difference between the first and last ratios */
            ud_delta = ud_ratio_last - ud_ratio_first;
            lr_delta = lr_ratio_last - lr_ratio_first;


            /* Accumulate the UD and LR delta values */
            this.gesture_ud_delta += ud_delta;
            this.gesture_lr_delta += lr_delta;

            /* Determine U/D gesture */
            if (this.gesture_ud_delta >= GESTURE_SENSITIVITY_1) {
                this.gesture_ud_count = 1;
            } else if (this.gesture_ud_delta <= -GESTURE_SENSITIVITY_1) {
                this.gesture_ud_count = -1;
            } else {
                this.gesture_ud_count = 0;
            }

            /* Determine L/R gesture */
            if (this.gesture_lr_delta >= GESTURE_SENSITIVITY_1) {
                this.gesture_lr_count = 1;
            } else if (this.gesture_lr_delta <= -GESTURE_SENSITIVITY_1) {
                this.gesture_lr_count = -1;
            } else {
                this.gesture_lr_count = 0;
            }

            /* Determine Near/Far gesture */
            if ((this.gesture_ud_count == 0) && (this.gesture_lr_count == 0)) {
                if ((Math.abs(ud_delta) < GESTURE_SENSITIVITY_2) && (Math.abs(lr_delta) < GESTURE_SENSITIVITY_2)) {

                    if ((ud_delta == 0) && (lr_delta == 0)) {
                        this.gesture_near_count++;
                    } else if ((ud_delta != 0) || (lr_delta != 0)) {
                        this.gesture_far_count++;
                    }

                    if ((this.gesture_near_count >= 10) && (this.gesture_far_count >= 2)) {
                        if ((ud_delta == 0) && (lr_delta == 0)) {
                            this.gesture_state = STATE.NEAR_STATE;
                        } else if ((ud_delta != 0) && (lr_delta != 0)) {
                            this.gesture_state = STATE.FAR_STATE;
                        }
                        return true;
                    }
                }
            } else {
                if ((Math.abs(ud_delta) < GESTURE_SENSITIVITY_2) && (Math.abs(lr_delta) < GESTURE_SENSITIVITY_2)) {

                    if ((ud_delta == 0) && (lr_delta == 0)) {
                        this.gesture_near_count++;
                    }

                    if (this.gesture_near_count >= 10) {
                        this.gesture_ud_count = 0;
                        this.gesture_lr_count = 0;
                        this.gesture_ud_delta = 0;
                        this.gesture_lr_delta = 0;
                    }
                }
            }



            return true;
        }

        /**
         * @brief Determines swipe direction or near/far state
         *
         * @return True if near/far event. False otherwise.
         */
        decodeGesture(): boolean {


            //("gesture_state"+gesture_state);
            // serial.writeLine("gesture_ud_count: "+gesture_ud_count+" ; "+"gesture_lr_count: "+gesture_lr_count);
            /* Return if near or far event is detected */
            if (this.gesture_state == STATE.NEAR_STATE) {
                this.gesture_motion = DIR.DIR_NEAR;
                return true;
            } else if (this.gesture_state == STATE.FAR_STATE) {
                this.gesture_motion = DIR.DIR_FAR;
                return true;
            }

            /* Determine swipe direction */
            if ((this.gesture_ud_count == -1) && (this.gesture_lr_count == 0)) {
                this.gesture_motion = DIR.DIR_UP;
            } else if ((this.gesture_ud_count == 1) && (this.gesture_lr_count == 0)) {
                this.gesture_motion = DIR.DIR_DOWN;
            } else if ((this.gesture_ud_count == 0) && (this.gesture_lr_count == 1)) {
                this.gesture_motion = DIR.DIR_RIGHT;
            } else if ((this.gesture_ud_count == 0) && (this.gesture_lr_count == -1)) {
                this.gesture_motion = DIR.DIR_LEFT;
            } else if ((this.gesture_ud_count == -1) && (this.gesture_lr_count == 1)) {
                if (Math.abs(this.gesture_ud_delta) > Math.abs(this.gesture_lr_delta)) {
                    this.gesture_motion = DIR.DIR_UP;
                } else {
                    this.gesture_motion = DIR.DIR_RIGHT;
                }
            } else if ((this.gesture_ud_count == 1) && (this.gesture_lr_count == -1)) {
                if (Math.abs(this.gesture_ud_delta) > Math.abs(this.gesture_lr_delta)) {
                    this.gesture_motion = DIR.DIR_DOWN;
                } else {
                    this.gesture_motion = DIR.DIR_LEFT;
                }
            } else if ((this.gesture_ud_count == -1) && (this.gesture_lr_count == -1)) {
                if (Math.abs(this.gesture_ud_delta) > Math.abs(this.gesture_lr_delta)) {
                    this.gesture_motion = DIR.DIR_UP;
                } else {
                    this.gesture_motion = DIR.DIR_LEFT;
                }
            } else if ((this.gesture_ud_count == 1) && (this.gesture_lr_count == 1)) {
                if (Math.abs(this.gesture_ud_delta) > Math.abs(this.gesture_lr_delta)) {
                    this.gesture_motion = DIR.DIR_DOWN;
                } else {
                    this.gesture_motion = DIR.DIR_RIGHT;
                }
            } else {
                return false;
            }

            return true;
        }
        /**
         * @brief Processes a gesture event and returns best guessed gesture
         *
         * @return Number corresponding to gesture. -1 on error.
         */
        readGesture(): number {
            let fifo_level: number = 0;
            let bytes_read: number = 0;
            let fifo_data: number[] = [];
            let gstatus: number;
            let motion: number;
            let l: number;
            //resetGestureParameters();
            gesture_data.d_data = pins.createBuffer(32);
            gesture_data.u_data = pins.createBuffer(32);
            gesture_data.l_data = pins.createBuffer(32);
            gesture_data.r_data = pins.createBuffer(32);
            //("read sensor start");
            /* Make sure that power and gesture is on and data is valid */
            if (!this.isGestureAvailable() || !(this.getMode() & 0b01000001)) {
                return DIR.DIR_NONE;
            }

            /* Keep looping as long as gesture data is valid */
            while (1) {
                basic.pause(30);
                /* Get the contents of the STATUS register. Is data still valid? */
                gstatus = this.APDS9960ReadReg(0xAF);
                /* If we have valid data, read in FIFO */
                if ((gstatus & 0b00000001) == 0b00000001) {
                    /* Read the current FIFO level */
                    fifo_level = this.APDS9960ReadReg(0xAE);

                    /* If there's stuff in the FIFO, read it into our data block */
                    if (fifo_level > 0) {
                        bytes_read = this.APDS9960ReadRegBlock(0xFC,
                            (fifo_level * 4));

                        for (let m = 0; m < bytes_read; m++) {

                            fifo_data[m] = data_buf[m];
                        }

                        if (bytes_read >= 4) {
                            for (let ii = 0; ii < bytes_read; ii = ii + 4) {
                                gesture_data.u_data[gesture_data.index] = fifo_data[ii + 0];
                                gesture_data.d_data[gesture_data.index] = fifo_data[ii + 1];
                                gesture_data.l_data[gesture_data.index] = fifo_data[ii + 2];
                                gesture_data.r_data[gesture_data.index] = fifo_data[ii + 3];
                                gesture_data.index++;
                                gesture_data.total_gestures++;
                            }

                            /* Filter and process gesture data. Decode near/far state */
                            if (this.processGestureData()) {
                                if (this.decodeGesture()) {
                                    motion = this.gesture_motion;
                                    this.resetGestureParameters();
                                    return motion;
                                }
                            }
                            /* Reset data */
                            gesture_data.index = 0;
                            gesture_data.total_gestures = 0;
                        }

                    }

                }
                else {
                    /* Determine best guessed gesture and clean up */
                    basic.pause(30);
                    this.decodeGesture();
                    motion = this.gesture_motion;


                    this.resetGestureParameters();
                    return motion;
                }

            }

            motion = this.gesture_motion;
            return motion;
        }

        read(): number {
            let result = GESTURE_TYPE.None;
            switch (this.readGesture()) {
                case DIR.DIR_UP:
                    result = GESTURE_TYPE.Up;
                    break;
                case DIR.DIR_DOWN:
                    result = GESTURE_TYPE.Down;
                    break;
                case DIR.DIR_LEFT:
                    result = GESTURE_TYPE.Left;
                    break;
                case DIR.DIR_RIGHT:
                    result = GESTURE_TYPE.Right;
                    break;
                case DIR.DIR_NEAR:
                    result = GESTURE_TYPE.Forward;
                    break;
                case DIR.DIR_FAR:
                    result = GESTURE_TYPE.Backward;
                    break;
                default:

            }
            return result;
        }


        readi2c(addr: number): number {
            return this.APDS9960ReadReg(addr);
        }


    }//end class APDS9960




    /**
     * 使用手势传感器前，先进行初始化。
     */
    //% weight=200 blockGap=8
    //% blockId=gesture_init block="Initialize the gesture sensor " group="apds手势传感器"
    export function gesture_init() {
        let apds9960 = new APDS9960();
        apds9960.pads9960_init();
        apds9960.enableGestureSensor(false);
        basic.pause(100);

        //initiate gesture monitoring
        control.inBackground(() => {
            let prevGst = GESTURE_TYPE.None;
            while (true) {
                let gst = apds9960.read();
                // basic.showNumber(gst);
                if (gst != prevGst) {
                    prevGst = gst;
                    control.raiseEvent(3100, gst, EventCreationMode.CreateAndFire);

                }
                basic.pause(50);
            }

        })
        // return apds9960;
    }


    /**
     * 手势传感器检测挥手动作：无、上、下、左、右、前进、后退。
     * @param gesture type of gesture to detect
     * @param handler code to run
     */
    //% weight=200 blockGap=8
    //% blockId=gesture_listener_block block="Detect gestures|%gesture" group="apds手势传感器"
    export function gesture_listener_block(gesture: GESTURE_TYPE, handler: () => void) {
        control.onEvent(3100, gesture, handler);
    }

     
}