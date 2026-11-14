// ---------------------------------------------------------------
// API address. CHANGE THIS if you test on a real phone!
//
//  - Android emulator : http://10.0.2.2:5000   (special alias for your PC)
//  - iOS simulator    : http://localhost:5000
//  - Real phone       : http://<YOUR-PC-WIFI-IP>:5000  (e.g. 192.168.1.10)
//                       Phone and PC must be on the same Wi-Fi network.
//
// Find your PC IP: Windows -> run "ipconfig" (IPv4 Address)
//                  Mac/Linux -> run "ifconfig" or "ip a"
// ---------------------------------------------------------------
import { Platform } from 'react-native';

// Put your PC's IP here to use a real phone, e.g. 'http://192.168.1.10:5000'
const PHONE_URL = '';

const DEFAULT_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';

export const API_BASE_URL = `${PHONE_URL || DEFAULT_URL}/api/tasks`;
