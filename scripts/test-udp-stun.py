"""Test STUN binding vers le VPS — vérifie si les ports UDP WebRTC (50000-50100)
sont réellement joignables depuis l'extérieur (pare-feu cloud Hostinger).

Envoie un STUN Binding Request et attend la réponse. Timeout = UDP bloqué.
"""
import socket
import struct
import random

MAGIC = 0x2112A442
TXID = random.randbytes(12)

def stun_binding_request():
    header = struct.pack(">HHI", 0x0001, 0, MAGIC) + TXID
    return header

def check(host: str, port: int, timeout: float = 6.0) -> bool:
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.settimeout(timeout)
    try:
        s.sendto(stun_binding_request(), (host, port))
        data, _ = s.recvfrom(2048)
        if len(data) >= 20:
            msg_type = struct.unpack(">H", data[:2])[0]
            print(f"  {host}:{port} → RÉPONSE reçue (type={msg_type:#06x}) → UDP OUVERT")
            return True
    except socket.timeout:
        print(f"  {host}:{port} → TIMEOUT → UDP bloqué (pare-feu cloud ?)")
    except Exception as e:
        print(f"  {host}:{port} → ERREUR: {e}")
    finally:
        s.close()
    return False

if __name__ == "__main__":
    host = "76.13.58.5"
    print("=== Test UDP WebRTC (STUN binding) ===")
    results = []
    for port in [50000, 50025, 50100, 7881]:
        results.append(check(host, port))
    # Test TCP 7881 (fallback WebRTC TCP)
    print("=== Test TCP 7881 (fallback ICE TCP) ===")
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(6)
    try:
        s.connect((host, 7881))
        print("  7881 TCP → CONNEXION OK")
    except Exception as e:
        print(f"  7881 TCP → ÉCHEC: {e}")
    finally:
        s.close()
    print("=== BILAN ===")
    print("UDP joignable" if any(results) else "UDP BLOQUÉ → WebRTC média impossible sans TURN/TCP forcé")
