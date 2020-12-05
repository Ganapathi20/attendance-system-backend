import cv2
import dlib
import numpy as np

def get_face_encodings(image):
    detected_faces = face_detector(image, 1)
    shapes_faces = [shape_predictor(image, face) for face in detected_faces]
    return [np.array(face_recognition_model.compute_face_descriptor(image, face_pose, 1)) for face_pose in shapes_faces]

## Capture image from webcam and get face encodings
# cap = cv2.VideoCapture(0)
# if cap.isOpened():
#     _,frame = cap.read()
#     cap.release()
#     cv2.destroyAllWindows()
# cv2.imwrite('img.jpg', frame)

face_detector = dlib.get_frontal_face_detector()
shape_predictor = dlib.shape_predictor('../models/shape_predictor_68_face_landmarks.dat')
face_recognition_model = dlib.face_recognition_model_v1('../models/dlib_face_recognition_resnet_model_v1.dat')
frame = cv2.imread("../test_images/sindhu.JPG") # comment it if using webcam
face_encodings_in_image = get_face_encodings(frame)
print(face_encodings_in_image)
