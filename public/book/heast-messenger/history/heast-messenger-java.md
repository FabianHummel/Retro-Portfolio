# Heast Messenger

![Heast-Messenger User interface](../heast-messenger.png)

The second iteration of the messenger was a lot more serious and included lots of architectural changes. The result is a clean project structure, separation of concern in regard of client-server (with a shared package used by both programs) but also adhering to a strict model-view-controller concept.

The UI itself only slightly improved, but many new features were addded to the backend. We were now using Netty for network communication and experimented with things like two factor authentication through email.

However, the biggest step ahead is yet to come, when we realized that Java would not be suitable for seriously continuing development of Heast and considered switching to C#.
