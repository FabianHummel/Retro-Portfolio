# DIY Car Hud

I thought I'd share my progress on my custom heads up display for my car. The reason I wanted something like this in the first place wasn't actually because I desperately wanted a HUD in my car, but I had some old phones laying around and thought of ideas of reusing them in a useful way.

The first prototype should be able to display synchronized lyrics of the currently playing song from Youtube Music and ideally should not conflict with systems like Android Auto.

## Hardware

![Modded Galaxy J5](diy-car-hud/modded-galaxy-j5.gif?width=200px&style={"float":"right","margin":"1rem"})

For this project I chose an old Samsung Galaxy J5 from 2015 and removed the battery for safety reasons (most batteries I had lying around were already bulging really badly and I didn't want to risk an inferno in my car). I wanted the phone to start and stop whenever it received power from the car anyway, so I naturally chose to hardwire it to the USB-connector from the car's cigarette lighter.

The USB-port gave me around 5 Volts (which is odd, I expected it to be 12 Volts? Maybe the cigarette lighter emits only 5...), but the phone wants a range between 3.8 and 4.2 Volt (which is identical to 0%-100% charge). So I bought a step-down converter (buck-converter) to reduce the output voltage from 5 to roughly 4 (50%-60% charge). I also didn't seem need the BMS from the old battery, it worked with simply connecting positive and negative to the first and third gold pin where the battery would be.

And honestly, the phone now looks like something I REALLY shouldn't carry around the airport xD

## Architecture

I had to use Bluetooth Tethering, because it would allow me to directly connect the old phone with my current phone whilst not interfering with the Android Auto connection, which runs via Wifi. To find the IP-address of the phone I had to install Termux to find out the correct address.

On the host-app, I can then insert the IP-address of the remote device and create a simple network socket to send (or receive) data.

However, due to reliability issues, I opted to create, connect and immediately close a socket each time I wanted to transfer data, because long-lived sockets always failed to stay open for some reason. This is not a big issue though, because the network is so small and local that connecting the two phones is unnoticably fast and I don't need to send data constantly. (Also the netcode is a lot simpler this way)

## Fetching Lyrics Data

Because apps on Android (and probably every other locked down OS out there) are sandboxed, we have limited ways to actually know what's happening from outside the own app. However, to our advantage, an app can listen to some events provided by the operating system such as notification changes. This way we can find out which song is currently playing, because the live-notification changes.

![Host-Screenshot](diy-car-hud/host-screenshot.jpg?width=200px&style={"float":"right","margin":"1rem"})

With this information I then had to fetch lyrics (ideally with timestamps). I chose https://lrclib.net, an open source library for many synchronized lyrics. The fetched data is then sent to the other phone where the data is parsed and displayed correctly.

A limitation of Android's notification API is that we don't have a way to get the progress of the currently played song, so skipping back or forth in the song would desync the displayed lyrics.

Regarding desynchronization: The time between receiving the notification and playback of the actual song is highly dependent on the internet connection, if the song is cached and the time it takes for the phones to connect, which are all factors that influence the delay. The exact timing can't be calculated so I had to find a way to manually synchronize the song if it's off by adding two buttons in the host-app to add or remove a 500ms offset, which works fine.

## Problems / TODOs

- The phone has to manually establish the Tethering connection, which is a little bit sad, but could probably be fixed with some automatically invoked macro or some root-level script.
- The phone currently doesn't boot on its own when receiving power, which I think can be fixed with configuring the phone via ADB.
- The HUD-app doesn't automatically start once the phone boots. This can be fixed with some apps that run stuff on startup, but these are incredibly slow or locked behind a paywall. Maybe the app itself can be programmed to start itself automatically?

## Future Thoughts

I plan to extend the app to show even more information than just lyrics, like directional info from Google Maps or Waze and notification previews from messengers like Whatsapp, etc.
