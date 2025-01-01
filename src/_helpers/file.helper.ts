export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const convertFilesToBase64 = (files: File[]): Promise<string[]> => {
  return Promise.all(files.map((file) => convertFileToBase64(file)));
};