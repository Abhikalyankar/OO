import axiosInstance from './index';

// Generic function to send a notification
export const sendNotification = async (payload) => {
  try {
    const response = await axiosInstance.post('/notification-logs/send_notification/', payload);
    return response.data;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

// Send panic notifications
export const sendPanicNotification = async (data) => {
  const { alertData, comment, images, selectedUserIds, selectedUsers, userEmails } = data;
  const currentTime = new Date();

  const person = alertData?.person || {};
  const isBlacklisted = person?.is_blacklisted || alertData?.is_blacklisted || false;
  const personName = person?.person_name || alertData?.detected_entity_name || 'Unknown Person';
  const detectionTime = alertData?.created_at ? new Date(alertData.created_at) : currentTime;
  const confidence = alertData?.confidence || 0;

  const cameraName = alertData?.camera_name || 'Unknown Camera';
  const locationName = alertData?.location_info?.location_name || 'Unknown Location';
  const buildingName = alertData?.building_info?.building_name;
  const floorName = alertData?.floor_info?.floor_name;

  let fullLocation = locationName;
  if (buildingName) fullLocation += `, ${buildingName}`;
  if (floorName) fullLocation += `, Floor ${floorName}`;

  const fullFrameImage = images?.fullFrameImage || alertData?.primary_image_url || alertData?.full_frame_context_url || null;
  const detectionImages = images?.detectionImages || (alertData?.detection_images || []).map(img => img.cropped_image).filter(Boolean);
  const activeImage = images?.activeImage || null;
  const totalImages = images?.totalImages || (fullFrameImage ? 1 : 0) + detectionImages.length;

  let subject = `Security Alert: ${personName} Detected at ${locationName}`;
  let alertLevel = 'medium';
  
  if (isBlacklisted) {
    subject = `🚨 CRITICAL THREAT: Blacklisted Person '${personName}' Detected at ${locationName}`;
    alertLevel = 'critical';
  } else if (confidence > 0.9) {
    subject = `High Confidence Alert: ${personName} Detected at ${locationName}`;
    alertLevel = 'high';
  }

  const notificationMessage = `
    A panic alert was raised for a security event.
    - Person: ${personName} ${isBlacklisted ? '(BLACKLISTED)' : ''}
    - Location: ${fullLocation}
    - Camera: ${cameraName}
    - Time: ${detectionTime.toLocaleString()}
    - Confidence: ${(confidence * 100).toFixed(1)}%
    - Images Available: ${totalImages} (${detectionImages.length} detections + ${fullFrameImage ? '1' : '0'} full frame)
    - Comment: ${comment}
  `;

  const payload = {
    type: "event",
    sub_type: "Camera",
    name: isBlacklisted ? "Blacklist Alert" : "Person Detection Alert",
    notification: notificationMessage.trim(),
    user_ids: selectedUserIds,
    org_id: 123,
    user_emails: userEmails,
    subject: subject,
    template_name: "email_template/panic_notification.html",
    meta_data: {
      ...alertData,
      person_name: personName,
      is_blacklisted: isBlacklisted,
      detection_time: detectionTime.toISOString(),
      confidence_percentage: (confidence * 100).toFixed(1),
      camera_name: cameraName,
      location_name: locationName,
      building_name: buildingName,
      floor_name: floorName,
      full_location: fullLocation,
      alert_level: alertLevel,
      panic_comment: comment,
      panic_raised_at: currentTime.toISOString(),
      full_frame_image_url: fullFrameImage,
      detection_images: detectionImages,
      active_image_url: activeImage,
      total_images_count: totalImages,
      images_data: images,
      selected_user_ids: selectedUserIds,
      selected_users: selectedUsers,
      user_emails: userEmails,
    }
  };

  console.log('📧 Sending panic notification:', payload);

  return sendNotification(payload);
};

// Generic function for sending detection notifications
export const sendDetectionNotification = async (data) => {
  const payload = {
    type: "Event",
    sub_type: "Camera",
    name: "Person Detected",
    notification: `A person has been detected by the security camera`,
    user_ids: [1],
    org_id: 123,
    user_emails: {
      "1": "ayush.tinkhede@skylarklabs.ai"
    },
    subject: "Security Alert: Person Detected",
    template_name: "email_template/detection_notification.html",
    meta_data: {
      person_name: data.personName,
      detection_time: data.detectionTime,
      location: data.location,
      device_name: data.deviceName,
      confidence: data.confidence,
      detection_id: data.detectionId,
      alert_level: data.alertLevel,
      additional_info: data.additionalInfo
    }
  };

  return sendNotification(payload);
};
