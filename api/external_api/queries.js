module.exports = {
  /*
   * Número de ficheros tratados, por apikey (cliente) y usuario (username) y mes.
   * Se accede solamente a la tabla files
   */
  countFiles: username => `
        SELECT  apikey, username, CONCAT(MONTH(tsin),'-',YEAR(tsin)) as mm, count(*) 
        FROM    files
        WHERE   apikey="cOrtesvalenc1anas"
        AND	    username="${username}" 			
        group by apikey, username, CONCAT(MONTH(tsin),'-',YEAR(tsin))
`,
  /*
   * Número de ficheros tratados, por apikey (cliente) y usuario (username) y mes.
   * Se accede solamente a la tabla files
   */
  getFilesData: fileid => `
    SELECT	files.id, apikey, charcount, pagecount, stats.Tchars, stats.Twords 
    FROM 	files, stats 
    WHERE 	files.fileid = stats.fileid 
    AND		apikey="cOrtesvalenc1anas"
    AND		files.fileid="${fileid}"
`
};
