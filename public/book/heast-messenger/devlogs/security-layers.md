# Five layers of security

## SSL Encryption:

All packets are secured by a secured socket layer (SSL) provided by DotNetty.
This is the first thing that is being initialized when connecting to a server.

## AES Encryption with asymmetric key exchange:

When the server now sends their pubkey to the client, the key exchange happens.

```c#
// Contains server public key
public void OnHello(HelloS2CPacket packet)
{
    var keypair = Aes.Create();
    /* initialization */

    RSACryptoServiceProvider rsa = new(4096);
    {
        rsa.ImportRSAPublicKey(packet.Key, out _);
        var success = rsa.TryEncrypt(key, encryptedKey, RSAEncryptionPadding.OaepSHA256, out _);
    }
    
    this.Ctx.Send(new KeyC2SPacket(/* AES key */));
}
```

## Packet Tracking via incremental IDs:

This security layer closely resembles TCP packet IDs, but is used
to expose MITM attacks by tracking all packets via an incremental ID.
If the client receives two packets with the same ID (impossibility),
the client is notified about a possible attack.

```c#
public void DecodePacket(/* Packet Info */)
{
    var id = buffer.ReadVarInt();
    if (id != ClientNetwork.PacketID + 1) {
        // Notify client
    } else {
        ClientNetwork.PacketID++;
    }
}
```

## Packet Zipping:

This layer is not really a 'security measure' but rather a layer
to make attacks more time consuming. Additionally, all packets
are being made smaller and easier to transport over the internet.

## Key-pinning:

This security layer describes the process of checking the active public key
against a list of official, up-to-date public keys used by the server.
If there is a mismatch between these two keys, the client can be 90%
sure that the connection got comprimised.

The keys are checked by fetching them from a public server api.
It would be unrealistic that this HTTP-request was intercepted
in the same exact moment as well.
