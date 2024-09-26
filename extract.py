
from stegoapp import *


image = base64_to_image(g_image_url)
I = np.array(image)

g_message = extract(I, g_password)





