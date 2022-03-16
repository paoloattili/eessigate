export class DownloadUtils {

    public static downloadAttachments(file: any, typeFile: string, nomeFile: string) {
        console.warn('file',file);
        console.warn('typeFile',typeFile);
        console.warn('nomeFile',nomeFile);
        let nome = nomeFile.split(';')[1].split('=')[1].replace(new RegExp(/"/g),'');
        console.warn('[nome file] ',nome);
        let newBlob = new Blob([file], {type: typeFile});
        const data = window.URL.createObjectURL(newBlob);
        let link = document.createElement('a');
        link.href = data;
        link.download = nome;
        link.click();
        window.URL.revokeObjectURL(data);
        link.remove();
    }
}
