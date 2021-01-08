import dlib
import cv2
import numpy as np
import sys
sys.path.append("face_recog/face_encodings")
import Encodings_and_Names

def __MAIN__(img_path):
    # print(img_path)
    students = []
    face_encodings=Encodings_and_Names.face_encodings()
    names = Encodings_and_Names.names()

    face_detector = dlib.get_frontal_face_detector()
    shape_predictor = dlib.shape_predictor('face_recog/models/shape_predictor_68_face_landmarks.dat')
    face_recognition_model = dlib.face_recognition_model_v1('face_recog/models/dlib_face_recognition_resnet_model_v1.dat')
    TOLERANCE = 0.45

    def get_face_encodings(image):
        detected_faces = face_detector(image, 1)
        shapes_faces = [shape_predictor(image, face) for face in detected_faces]
        return [np.array(face_recognition_model.compute_face_descriptor(image, face_pose, 1)) for face_pose in shapes_faces]

    def find_match(known_faces, names, face):
        matches = np.linalg.norm(known_faces - face, axis=1) <= TOLERANCE
        count = 0
        for match in matches:
            if match:
                # name, roll
                return[names[count].split(' ')[0], names[count].split(" ")[-2].split("-")[1]]
                return names[count].split(' ')[0]

            count += 1
        return 'Unknown'

    img = cv2.imread(img_path)
    # print(img.shape)
    face_encodings_in_image = get_face_encodings(img)

    if(len(face_encodings_in_image) == 1):
        match = find_match(face_encodings, names, face_encodings_in_image[0])
        if match!='Unknown':
            students.append(match)

    else:
        for i in range(len(face_encodings_in_image)):
            match = find_match(face_encodings, names, face_encodings_in_image[i])
            if match!='Unknown':
                students.append(match)

    return students