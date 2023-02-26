export function downloadFile(file: File) {
  const link = document.createElement('a');
  link.setAttribute('download', file.name);
  link.href = URL.createObjectURL(file)
  document.body.appendChild(link);
  link.click();
  link.remove();
}