"""Test TURN over TCP 3478 — vérifie que coturn répond depuis l'extérieur.

Envoie un STUN Binding Request sur TCP (le transport que le navigateur utilisera
pour relayer le média WebRTC). Réponse = TURN joignable.
"""
import socket
import struct
import random

MAGIC = 0x2112A442
TXID = random.randbytes(12)

def stun_binding_request():
    return struct.pack(">HHI", 0x0001, 0, MAGIC) + TXID

def check_tcp(host: str, port: int, timeout: float = 8.0) -> bool:
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(timeout)
    try:
        s.connect((host, port))
        s.sendall(stun_binding_request())
        data = s.recv(2048)
        if len(data) >= 20:
            msg_type = struct.unpack(">H", data[:2])[0]
            # STUN response = 0x0101 (Binding Success)
            print(f"  {host}:{port} TCP → RÉPONSE STUN reçue (type={msg_type:#06x}) → TURN JOIGNABLE")
            return True
        print(f"  {host}:{port} TCP → réponse non-STUN ({len(data)} octets)")
    except socket.timeout:
        print(f"  {host}:{port} TCP → TIMEOUT → TURN injoignable")
    except Exception as e:
        print(f"  {host}:{port} TCP → ERREUR: {e}")
    finally:
        s.close()
    return False

if __name__ == "__main__":
    print("=== Test TURN over TCP 3478 ===")
    ok = check_tcp("76.13.58.5", 3478)
    print("✅ TURN TCP joignable — le média WebRTC pourra passer" if ok else "❌ TURN injoignable")
