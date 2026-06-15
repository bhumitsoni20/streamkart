import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';
import { v4 as uuidv4 } from 'uuid';

export const uploadImage = async (file, folder = 'avatars') => {
  if (!storage) throw new Error('Firebase Storage is not initialized');
  if (!file) throw new Error('No file provided');

  const fileExtension = file.name ? file.name.split('.').pop() : 'jpg';
  const fileName = `${uuidv4()}.${fileExtension}`;
  const storageRef = ref(storage, `${folder}/${fileName}`);

  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload image to storage');
  }
};
