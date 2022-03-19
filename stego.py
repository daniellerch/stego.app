
import re
import io
import base64
import scipy.signal
from PIL import Image
import numpy as np


def base64_to_image(base64_str):
    base64_data = re.sub('^data:image/.+;base64,', '', base64_str)
    byte_data = base64.b64decode(base64_data)
    image_data = io.BytesIO(byte_data)
    img = Image.open(image_data)
    return img


def HILL(I):                                                                
    HF1 = np.array([                                                             
        [-1, 2, -1],                                                             
        [ 2,-4,  2],                                                             
        [-1, 2, -1]                                                              
    ])                                                                           
    H2 = np.ones((3, 3)).astype(np.float)/3**2                                   
    HW = np.ones((15, 15)).astype(np.float)/15**2                                
                                                                                 
    R1 = scipy.signal.convolve2d(I, HF1, mode='same', boundary='symm')
    W1 = scipy.signal.convolve2d(np.abs(R1), H2, mode='same', boundary='symm')
    rho=1./(W1+10**(-10))
    cost = scipy.signal.convolve2d(rho, HW, mode='same', boundary='symm')
    return cost     




image = base64_to_image(image_url)
I = np.array(image)
print("--->", I.shape)

cost = HILL(I[:,:,0])
print(cost)

#I = Image.open(io.BytesIO(bytearray(img.encode())))
#I = Image.open(io.BytesIO(img.encode()))
#I = Image.open(io.BytesIO(img.encode()))
#I = Image.open(io.BytesIO(img.encode()))
#print(img.encode())

#print( io.BytesIO(img.encode()) )


#enc = img.encode()
#image = Image.frombuffer("RGB", (512, 512), enc)
#I = np.asarray(image)
#print(I.shape)
#print(I[:8,:8,0])

