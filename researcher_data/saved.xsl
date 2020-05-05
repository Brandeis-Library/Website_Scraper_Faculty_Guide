<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:template match="/">

    <html>
      <head>

        <style>
        </style>

      </head>
      <body>
        <h1>Researchers</h1>
        <xsl:for-each select="users/user">
          <div> Primary ID: <span><xsl:value-of select="primary_id" /></span></div>
          <div> Is Researcher: <span><xsl:value-of select="is_researcher" /></span></div>
        </xsl:for-each>
        <xsl:for-each select="users/user/researcher">
          <div> Researcher Language: <span><xsl:value-of select="researcher_languages/researcher_language" /></span></div>
        </xsl:for-each>

      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
