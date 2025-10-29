export const BASE_PROTOCOL = "http";
export const BASE_HOST = `localhost:8500`;
export const BASE_PROTOCOL_WS = window.location.protocol === "https:" ? "wss" : "ws";
export const BASE_URL = `${BASE_PROTOCOL}://${BASE_HOST}`;
export const WS_BASE_URL = `${BASE_PROTOCOL_WS}://${BASE_HOST}`;
export const TESTING = true;
export const GOOGLE_MAPS_API_KEY = 'AIzaSyC-bqnjCFZ82yl51ys00XkNmd-vLxHSVQE';
export const BASE_HOST2 = `192.168.0.108:8000`;
export const BASE_URL2 = `${BASE_PROTOCOL}://${BASE_HOST2}`;

// Mock alerts data
export const mockAlerts = [
  {
    id: 1520,
    person: {
      is_blacklisted: false,
      person_name: "Harish mankar"
    },
    camera_id: "7df67b2c-0867-11f0-8395-0242ac180007",
    cropped_image: "http://fr.server.skylarklabs.ai/media/person_records/03ddfd8a-048c-11f0-aa9f-0242ac180007/31ebf27162-c19b-45f5-9979-518b268939af.jpg",
    metadata: {
      age: 7,
      box: [1517, 324, 1591, 388],
      name: "Harish mankar",
      track_id: 16,
      camera_id: "7df67b2c-0867-11f0-8395-0242ac180007",
      confidence: 0.793182373046875,
      detected_at: "2025-03-24 09:53:52"
    },
    created_at: "2025-03-24T09:53:53.332231+05:30",
    is_false: true
  },
  {
    id: 1519,
    person: {
      is_blacklisted: false,
      person_name: "Harish mankar"
    },
    camera_id: "712201e6-0867-11f0-bf19-0242ac180007",
    cropped_image: "http://fr.server.skylarklabs.ai/media/person_records/03ddfd8a-048c-11f0-aa9f-0242ac180007/4764e2f136c-3ace-4a9a-90a1-0f4d367544df.jpg",
    metadata: {
      age: 7,
      box: [865, 226, 969, 325],
      name: "Harish mankar",
      track_id: 51,
      camera_id: "712201e6-0867-11f0-bf19-0242ac180007",
      confidence: 0.9885888230055571,
      detected_at: "2025-03-24 09:53:50"
    },
    created_at: "2025-03-24T09:53:52.128672+05:30",
    is_false: false
  },
  {
    id: 1518,
    person: {
      is_blacklisted: false,
      person_name: "Harish mankar"
    },
    camera_id: "946728e6-063e-11f0-b4cc-0242ac180007",
    cropped_image: "http://fr.server.skylarklabs.ai/media/person_records/03ddfd8a-048c-11f0-aa9f-0242ac180007/55845bd91c9-dde8-45fb-b979-db7b91ff9259.jpg",
    metadata: {
      age: 7,
      box: [563, 2, 618, 47],
      name: "Harish mankar",
      track_id: 8,
      camera_id: "946728e6-063e-11f0-b4cc-0242ac180007",
      confidence: 0.6848742067813873,
      detected_at: "2025-03-24 09:53:50"
    },
    created_at: "2025-03-24T09:53:51.528593+05:30",
    is_false: false
  },
  {
    id: 1517,
    person: {
      is_blacklisted: false,
      person_name: "Harish mankar"
    },
    camera_id: "7df67b2c-0867-11f0-8395-0242ac180007",
    cropped_image: "http://fr.server.skylarklabs.ai/media/person_records/03ddfd8a-048c-11f0-aa9f-0242ac180007/164afecb8c2-570a-4259-849d-e412670cc0a1.jpg",
    metadata: {
      age: 7,
      box: [1420, 317, 1505, 398],
      name: "Harish mankar",
      track_id: 15,
      camera_id: "7df67b2c-0867-11f0-8395-0242ac180007",
      confidence: 0.6743715703487396,
      detected_at: "2025-03-24 09:53:47"
    },
    created_at: "2025-03-24T09:53:48.127460+05:30",
    is_false: false
  },
];
