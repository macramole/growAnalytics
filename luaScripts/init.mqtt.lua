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

MQTT_CLIENT_ID = "d205c820-dd3c-11e7-86d0-83752e057225"
MQTT_USER = "81ed21e0-dd3b-11e7-b67f-67bba9556416"
MQTT_PASS = "eb79f16e6a2d56a357f94dbaa7bb44305fe5e7ea"
MQTT_HOST = "mqtt.mydevices.com"

MQTT_SEND_SENSOR_AMBIENTE_TEMP_AFUERA = "v1/" .. MQTT_USER  .. "/things/" .. MQTT_CLIENT_ID .. "/data/0"
MQTT_SEND_SENSOR_AMBIENTE_HUMEDAD_AFUERA = "v1/" .. MQTT_USER  .. "/things/" .. MQTT_CLIENT_ID .. "/data/1"
MQTT_SEND_SENSOR_AMBIENTE_TEMP_ADENTRO = "v1/" .. MQTT_USER  .. "/things/" .. MQTT_CLIENT_ID .. "/data/5"
MQTT_SEND_SENSOR_AMBIENTE_HUMEDAD_ADENTRO = "v1/" .. MQTT_USER  .. "/things/" .. MQTT_CLIENT_ID .. "/data/6"

MQTT_SEND_SENSOR_PLANTA_1 = "v1/" .. MQTT_USER  .. "/things/" .. MQTT_CLIENT_ID .. "/data/2"
MQTT_SEND_SENSOR_PLANTA_2 = "v1/" .. MQTT_USER  .. "/things/" .. MQTT_CLIENT_ID .. "/data/3"
MQTT_SEND_SENSOR_PLANTA_3 = "v1/" .. MQTT_USER  .. "/things/" .. MQTT_CLIENT_ID .. "/data/4"

m = mqtt.Client(MQTT_CLIENT_ID, 120, MQTT_USER , MQTT_PASS )

gpio.mode(PIN_SOIL_1,gpio.OUTPUT)
gpio.mode(PIN_SOIL_2,gpio.OUTPUT)
gpio.mode(PIN_SOIL_3,gpio.OUTPUT)

m:connect(MQTT_HOST , 1883, 0, function(client)
    print("MQTT connected")

    miTimer = tmr.create()
    miTimer:alarm(5000, tmr.ALARM_AUTO, function()
    -- DHT
    status, temp, humi, temp_dec, humi_dec = dht.read(PIN_DHT_AFUERA)
    if status == dht.OK then
        print(string.format("AFUERA Temperature:%d.%03d;Humidity:%d.%03d\r\n",
              math.floor(temp),
              temp_dec,
              math.floor(humi),
              humi_dec
        ))

        strTemperatura = math.floor(temp) .. "." .. temp_dec
        strHumedad = math.floor(humi) .. "." .. humi_dec
        
        client:publish(MQTT_SEND_SENSOR_AMBIENTE_TEMP_AFUERA, strTemperatura, 0, 0)
        client:publish(MQTT_SEND_SENSOR_AMBIENTE_HUMEDAD_AFUERA, strHumedad, 0, 0)
    
    elseif status == dht.ERROR_CHECKSUM then
        print( "DHT Checksum error." )
    elseif status == dht.ERROR_TIMEOUT then
        print( "DHT timed out." )
    end

    status, temp, humi, temp_dec, humi_dec = dht.read(PIN_DHT_ADENTRO)
    if status == dht.OK then
        print(string.format("ADENTRO Temperature:%d.%03d;Humidity:%d.%03d\r\n",
              math.floor(temp),
              temp_dec,
              math.floor(humi),
              humi_dec
        ))

        strTemperatura = math.floor(temp) .. "." .. temp_dec
        strHumedad = math.floor(humi) .. "." .. humi_dec
        
        client:publish(MQTT_SEND_SENSOR_AMBIENTE_TEMP_ADENTRO, strTemperatura, 0, 0)
        client:publish(MQTT_SEND_SENSOR_AMBIENTE_HUMEDAD_ADENTRO, strHumedad, 0, 0)
    
    elseif status == dht.ERROR_CHECKSUM then
        print( "DHT Checksum error." )
    elseif status == dht.ERROR_TIMEOUT then
        print( "DHT timed out." )
    end
    
    -- ADC
    gpio.write(PIN_SOIL_1,gpio.LOW)
    gpio.write(PIN_SOIL_2,gpio.LOW)
    gpio.write(PIN_SOIL_3,gpio.LOW)

    gpio.write(PIN_SOIL_1,gpio.HIGH)
    tmr.delay(100000)
    client:publish(MQTT_SEND_SENSOR_PLANTA_1, 1024 - adc.read(0), 0, 0)
    gpio.write(PIN_SOIL_1,gpio.LOW)
    tmr.delay(100000)

    gpio.write(PIN_SOIL_2,gpio.HIGH)
    tmr.delay(100000)
    client:publish(MQTT_SEND_SENSOR_PLANTA_2, 1024 - adc.read(0), 0, 0)
    gpio.write(PIN_SOIL_2,gpio.LOW)
    tmr.delay(100000)

    gpio.write(PIN_SOIL_3,gpio.HIGH)
    tmr.delay(100000)
    client:publish(MQTT_SEND_SENSOR_PLANTA_3, 1024 - adc.read(0), 0, 0)
    gpio.write(PIN_SOIL_3,gpio.LOW)
    tmr.delay(100000)
 
end)  
end,
function(client, reason)
  print("failed reason: " .. reason)
end)