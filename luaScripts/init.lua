-- SERIE
uart.setup(0,115200,8,0,1)

-- WIFI
wifi.setmode(wifi.STATION)

station_cfg={}
station_cfg.ssid="casamacramole"
station_cfg.pwd="supermacramole"
-- station_cfg.ssid="gallardcore"
-- station_cfg.pwd="gallardo437"
wifi.sta.config(station_cfg)

wifi.sta.connect()
tmr.delay(10000000)   -- wait 1,000,000 us = 10 second
print(wifi.sta.status())
print(wifi.sta.getip())

-- SENSORES
-- init mqtt client with logins, keepalive timer 120sec
PIN_DHT_AFUERA = 1
PIN_DHT_ADENTRO = 5
PIN_SOIL_1 = 2
PIN_SOIL_2 = 3
PIN_SOIL_3 = 4

-- POST_URL = "http://192.168.0.27/postTest/index.php"
-- POST_URL = "http://192.168.0.27:8080"
-- POST_URL = "http://192.168.0.27/growAnalytics/save.php"
POST_URL = "http://leandrogarber.info/proyectos/growAnalytics/save.php"

gpio.mode(PIN_SOIL_1,gpio.OUTPUT)
gpio.mode(PIN_SOIL_2,gpio.OUTPUT)
gpio.mode(PIN_SOIL_3,gpio.OUTPUT)

miTimer = tmr.create()
miTimer:alarm(5000, tmr.ALARM_AUTO, function()
    jsonToSend = "{"
    
    -- DHT
    status, temp, humi, temp_dec, humi_dec = dht.read(PIN_DHT_AFUERA)
    strTemperatura = -1
    strHumedad = -1
    if status == dht.OK then
        print(string.format("AFUERA Temperature:%d.%03d;Humidity:%d.%03d\r\n",
              math.floor(temp),
              temp_dec,
              math.floor(humi),
              humi_dec
        ))
    
        strTemperatura = math.floor(temp) .. "." .. temp_dec
        strHumedad = math.floor(humi) .. "." .. humi_dec
    
    elseif status == dht.ERROR_CHECKSUM then
        print( "DHT 1 Checksum error." )
    elseif status == dht.ERROR_TIMEOUT then
        print( "DHT 1 timed out." )
    end

    jsonToSend = jsonToSend .. '"temperaturaAfuera":"' .. strTemperatura .. '", "humedadAfuera" : "' .. strHumedad .. '", '
    
    status, temp, humi, temp_dec, humi_dec = dht.read(PIN_DHT_ADENTRO)
    strTemperatura = -1
    strHumedad = -1
    if status == dht.OK then
        print(string.format("ADENTRO Temperature:%d.%03d;Humidity:%d.%03d\r\n",
              math.floor(temp),
              temp_dec,
              math.floor(humi),
              humi_dec
        ))
    
        strTemperatura = math.floor(temp) .. "." .. temp_dec
        strHumedad = math.floor(humi) .. "." .. humi_dec
    
    elseif status == dht.ERROR_CHECKSUM  then
        print( "DHT 2 Checksum error." )
    elseif status == dht.ERROR_TIMEOUT then
        print( "DHT 2 timed out." )
    end

    jsonToSend = jsonToSend .. '"temperaturaAdentro":"' .. strTemperatura .. '", "humedadAdentro" : "' .. strHumedad .. '", '

    -- ADC
    gpio.write(PIN_SOIL_1,gpio.LOW)
    gpio.write(PIN_SOIL_2,gpio.LOW)
    gpio.write(PIN_SOIL_3,gpio.LOW)
    
    gpio.write(PIN_SOIL_1,gpio.HIGH)
    tmr.delay(100000)
    jsonToSend = jsonToSend .. '"humedadTierra1":"' .. ( 1024 - adc.read(0) ) .. '", '
    gpio.write(PIN_SOIL_1,gpio.LOW)
    tmr.delay(100000)
    
    gpio.write(PIN_SOIL_2,gpio.HIGH)
    tmr.delay(100000)
    jsonToSend = jsonToSend .. '"humedadTierra2":"' .. ( 1024 - adc.read(0) ) .. '", '
    gpio.write(PIN_SOIL_2,gpio.LOW)
    tmr.delay(100000)
    
    gpio.write(PIN_SOIL_3,gpio.HIGH)
    tmr.delay(100000)
    jsonToSend = jsonToSend .. '"humedadTierra3":"' .. ( 1024 - adc.read(0) ) .. '" ' -- guarda que le saque la coma
    gpio.write(PIN_SOIL_3,gpio.LOW)
    tmr.delay(100000)

    -- SEND JSON
    jsonToSend = jsonToSend .. "}"
    
    print("Sending JSON")
    print(jsonToSend)

    http.post(POST_URL,
        'Content-Type: application/json\r\n',
        jsonToSend,
        function(code, data)
            if (code < 0) then
                print("HTTP request failed")
            else
                print(code, data)
            end
        end
    )
end)

-- miTimer:unregister()