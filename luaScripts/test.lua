wifi.setmode(wifi.STATION)

-- print ap list
function listap(t)
    for k,v in pairs(t) do
        print(k.." : "..v)
    end
end
wifi.sta.getap(listap)

station_cfg={}
station_cfg.ssid="gallardcore"
station_cfg.pwd="gallardo437"
wifi.sta.config(station_cfg)

wifi.sta.connect()
tmr.delay(1000000)   -- wait 1,000,000 us = 1 second
print(wifi.sta.status())
print(wifi.sta.getip())

a = { te = 1, tg = 2 }
print ( a.te )
enc = sjson.encoder(a)
sjson.decoder( enc )
print(a)


-- MQTT
-- init mqtt client with logins, keepalive timer 120sec
PIN_DHT = 1
PIN_SOIL_1 = 2
PIN_SOIL_2 = 3
PIN_SOIL_3 = 4

MQTT_CLIENT_ID = "d205c820-dd3c-11e7-86d0-83752e057225"
MQTT_USER = "81ed21e0-dd3b-11e7-b67f-67bba9556416"
MQTT_PASS = "eb79f16e6a2d56a357f94dbaa7bb44305fe5e7ea"
MQTT_HOST = "mqtt.mydevices.com"

MQTT_SEND_SENSOR_AMBIENTE_TEMP = "v1/" .. MQTT_USER  .. "/things/" .. MQTT_CLIENT_ID .. "/data/0"
MQTT_SEND_SENSOR_AMBIENTE_HUMEDAD = "v1/" .. MQTT_USER  .. "/things/" .. MQTT_CLIENT_ID .. "/data/1"

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
    status, temp, humi, temp_dec, humi_dec = dht.read(PIN_DHT)
    if status == dht.OK then
        print(string.format("DHT Temperature:%d.%03d;Humidity:%d.%03d\r\n",
              math.floor(temp),
              temp_dec,
              math.floor(humi),
              humi_dec
        ))

        strTemperatura = math.floor(temp) .. "." .. temp_dec
        strHumedad = math.floor(humi) .. "." .. humi_dec
        
        client:publish(MQTT_SEND_SENSOR_AMBIENTE_TEMP, strTemperatura, 0, 0)
        client:publish(MQTT_SEND_SENSOR_AMBIENTE_HUMEDAD, strHumedad, 0, 0)
    
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
    client:publish(MQTT_SEND_SENSOR_PLANTA_1, adc.read(0), 0, 0)
    gpio.write(PIN_SOIL_1,gpio.LOW)
    tmr.delay(100000)

    gpio.write(PIN_SOIL_2,gpio.HIGH)
    tmr.delay(100000)
    client:publish(MQTT_SEND_SENSOR_PLANTA_2, adc.read(0), 0, 0)
    gpio.write(PIN_SOIL_2,gpio.LOW)
    tmr.delay(100000)

    gpio.write(PIN_SOIL_3,gpio.HIGH)
    tmr.delay(100000)
    client:publish(MQTT_SEND_SENSOR_PLANTA_3, adc.read(0), 0, 0)
    gpio.write(PIN_SOIL_3,gpio.LOW)
    tmr.delay(100000)
 
end)  
end,
function(client, reason)
  print("failed reason: " .. reason)
end)


miTimer:unregister()
m:close()

-------------

-- DHT

pin = 1
miTimer = tmr.create()
miTimer:alarm(1000, tmr.ALARM_AUTO, function()
    status, temp, humi, temp_dec, humi_dec = dht.read(pin)
    if status == dht.OK then
        -- Integer firmware using this example
        print(string.format("DHT Temperature:%d.%03d;Humidity:%d.%03d\r\n",
              math.floor(temp),
              temp_dec,
              math.floor(humi),
              humi_dec
        ))

        -- datos = { temperatura = math.floor(temp) .. "." .. temp_dec, humedad = math.floor(humi) .. "." .. humi_dec }

        strTemperatura = math.floor(temp) .. "." .. temp_dec
        strHumedad = math.floor(humi) .. "." .. humi_dec
        
        --http.post('http://192.168.0.27:8080',
        --  'Content-Type: application/json\r\n',
        --  '{"temperatura":"' .. strTemperatura .. '", "humedad" : "' .. strHumedad .. '"}',
        --  function(code, data)
        --    if (code < 0) then
        --      print("HTTP request failed")
        --    else
        --      print(code, data)
        --    end
        --  end)
    
    elseif status == dht.ERROR_CHECKSUM then
        print( "DHT Checksum error." )
    elseif status == dht.ERROR_TIMEOUT then
        print( "DHT timed out." )
    end
 
end)

miTimer:unregister()

----

-- ADC
-- in you init.lua:
if adc.force_init_mode(adc.INIT_ADC)
then
    print("needs to change")
  --node.restart()
  return -- don't bother continuing, the restart is scheduled
else
    print("adc is configured ok")
end

print(adc.read(0))
