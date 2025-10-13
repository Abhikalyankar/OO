export const BASE_PROTOCOL = "http";
export const BASE_HOST = `localhost:8500`;
export const BASE_PROTOCOL_WS = window.location.protocol === "https:" ? "wss" : "ws";
export const BASE_URL: string = `${BASE_PROTOCOL}://${BASE_HOST}`;
export const WS_BASE_URL = `${BASE_PROTOCOL_WS}://${BASE_HOST}`;
export const TESTING: boolean = true;
export const GOOGLE_MAPS_API_KEY = 'AIzaSyC-bqnjCFZ82yl51ys00XkNmd-vLxHSVQE';
export const BASE_HOST2 = `localhost:8300`;
export const BASE_URL2 : string =`${BASE_PROTOCOL}://${BASE_HOST2}`;
// Enhanced mock alerts data with face detection information
// export const mockAlerts = [
//     { 
//       id: 1, 
//       type: 'warning', 
//       message: 'Unrecognized face detected', 
//       location: 'Front Entrance',
//       time: '2 minutes ago',
//       faceData: {
//         name: 'Sarah Johnson',
//         identified: false,
//         image: '/new_alert.jpg',
//         confidence: 71,
//         additionalInfo: 'Person attempted entry at restricted hours. Facial features logged for future reference.'
//       }
//     },
//     { 
//       id: 1, 
//       type: 'error', 
//       message: 'Unrecognized face detected', 
//       location: 'Front Entrance',
//       time: '2 minutes ago',
//       faceData: {
//         identified: false,
//         image: '/new_alert.jpg',
//         confidence: 42,
//         additionalInfo: 'Person attempted entry at restricted hours. Facial features logged for future reference.'
//       }
//     },
//     { 
//       id: 2, 
//       type: 'success', 
//       message: 'John Smith recognized', 
//       location: 'Lobby',
//       time: '15 minutes ago',
//       faceData: {
//         identified: true,
//         name: 'John Smith',
//         image: '/new_alert.jpg',
//         id: 'EMP-1024',
//         confidence: 98.7,
//         accessLevel: 'High',
//         additionalInfo: 'Regular entry time pattern confirmed. Employee accessed building using facial recognition.'
//       }
//     },
    
//     { 
//       id: 5, 
//       type: 'warning', 
//       message: 'Partial face match detected', 
//       location: 'Back Door',
//       time: '1 hour ago',
//       faceData: {
//         identified: true,
//         name: 'Sarah Johnson',
//         image: '/new_alert.jpg',
//         id: 'VIS-4287',
//         confidence: 76.3,
//         accessLevel: 'Medium',
//         additionalInfo: 'Partial match detected. Lighting conditions may have affected recognition accuracy.'
//       }
//     },
//     { 
//       id: 6, 
//       type: 'success', 
//       message: 'Michael Brown recognized', 
//       location: 'Conference Room',
//       time: '2 hours ago',
//       faceData: {
//         identified: true,
//         name: 'Michael Brown',
//         image: '/new_alert.jpg',
//         id: 'EMP-3582',
//         confidence: 99.2,
//         accessLevel: 'High',
//         additionalInfo: null
//       }
//     },
//     { 
//       id: 7, 
//       type: 'warning', 
//       message: 'Unknown person with visitor badge', 
//       location: 'East Wing',
//       time: '3 hours ago',
//       faceData: {
//         identified: false,
//         image: '/new_alert.jpg',
//         confidence: 71,
//         additionalInfo: 'Person wearing visitor badge but not matching any registered visitor profiles.'
//       }
//     },
//     { 
//       id: 8, 
//       type: 'success', 
//       message: 'Emily Wilson recognized', 
//       location: 'Main Gate',
//       time: '4 hours ago',
//       faceData: {
//         identified: true,
//         name: 'Emily Wilson',
//         image: '/new_alert.jpg',
//         id: 'CON-7824',
//         confidence: 95.8,
//         accessLevel: 'Low',
//         additionalInfo: 'Contractor recognized. Limited access granted for today only.'
//       }
//     },
// ];
export const mockAlerts = [
  {
    "id": 1520,
    "person": {
        "is_blacklisted": false,
        "person_name": "Harish mankar"
    },
    "camera_id": "7df67b2c-0867-11f0-8395-0242ac180007",
    "cropped_image": "http://fr.server.skylarklabs.ai/media/person_records/03ddfd8a-048c-11f0-aa9f-0242ac180007/31ebf27162-c19b-45f5-9979-518b268939af.jpg",
    "metadata": {
        "age": 7,
        "box": [
            1517,
            324,
            1591,
            388
        ],
        "name": "Harish mankar",
        "track_id": 16,
        "camera_id": "7df67b2c-0867-11f0-8395-0242ac180007",
        "confidence": 0.793182373046875,
        "detected_at": "2025-03-24 09:53:52"
    },
    "created_at": "2025-03-24T09:53:53.332231+05:30",
    "is_false": true
},
{
    "id": 1519,
    "person": {
        "is_blacklisted": false,
        "person_name": "Harish mankar"
    },
    "camera_id": "712201e6-0867-11f0-bf19-0242ac180007",
    "cropped_image": "http://fr.server.skylarklabs.ai/media/person_records/03ddfd8a-048c-11f0-aa9f-0242ac180007/4764e2f136c-3ace-4a9a-90a1-0f4d367544df.jpg",
    "metadata": {
        "age": 7,
        "box": [
            865,
            226,
            969,
            325
        ],
        "name": "Harish mankar",
        "track_id": 51,
        "camera_id": "712201e6-0867-11f0-bf19-0242ac180007",
        "confidence": 0.9885888230055571,
        "detected_at": "2025-03-24 09:53:50"
    },
    "created_at": "2025-03-24T09:53:52.128672+05:30",
    "is_false": false
},
{
    "id": 1518,
    "person": {
        "is_blacklisted": false,
        "person_name": "Harish mankar"
    },
    "camera_id": "946728e6-063e-11f0-b4cc-0242ac180007",
    "cropped_image": "http://fr.server.skylarklabs.ai/media/person_records/03ddfd8a-048c-11f0-aa9f-0242ac180007/55845bd91c9-dde8-45fb-b979-db7b91ff9259.jpg",
    "metadata": {
        "age": 7,
        "box": [
            563,
            2,
            618,
            47
        ],
        "name": "Harish mankar",
        "track_id": 8,
        "camera_id": "946728e6-063e-11f0-b4cc-0242ac180007",
        "confidence": 0.6848742067813873,
        "detected_at": "2025-03-24 09:53:50"
    },
    "created_at": "2025-03-24T09:53:51.528593+05:30",
    "is_false": false
},
{
    "id": 1517,
    "person": {
        "is_blacklisted": false,
        "person_name": "Harish mankar"
    },
    "camera_id": "7df67b2c-0867-11f0-8395-0242ac180007",
    "cropped_image": "http://fr.server.skylarklabs.ai/media/person_records/03ddfd8a-048c-11f0-aa9f-0242ac180007/164afecb8c2-570a-4259-849d-e412670cc0a1.jpg",
    "metadata": {
        "age": 7,
        "box": [
            1420,
            317,
            1505,
            398
        ],
        "name": "Harish mankar",
        "track_id": 15,
        "camera_id": "7df67b2c-0867-11f0-8395-0242ac180007",
        "confidence": 0.6743715703487396,
        "detected_at": "2025-03-24 09:53:47"
    },
    "created_at": "2025-03-24T09:53:48.127460+05:30",
    "is_false": false
},
];
