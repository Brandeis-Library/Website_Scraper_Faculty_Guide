<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:template match="/">

    <html>
      <head>

        <style>
          <!-- body ul {
        list-style: none;
        } -->
        </style>

      </head>
      <body>
        <h1>Researchers</h1>
        <xsl:for-each select="users/user">
          <div>
            <strong >Primary ID: </strong>
            <span>
              <xsl:value-of select="primary_id" />
            </span>
          </div>
          <div> Is Researcher: <span>
            <xsl:value-of select="is_researcher" disable-output-escaping="yes" />
          </span>
        </div>

        <xsl:for-each select="researcher">
          <div> Researcher Language: <span>
            <xsl:value-of select="researcher_languages/researcher_language" disable-output-escaping="yes"/>
          </span>
        </div>
      </xsl:for-each>
      <xsl:for-each select="researcher/researcher_organization_affiliations/researcher_organization_affiliation">
        <div> Researcher Organizations: <span>
          <xsl:value-of select="organization_code" disable-output-escaping="yes" />
          <span>   Position:
            <xsl:value-of select="position" disable-output-escaping="yes" />
          </span>
          <span>   Title:
            <xsl:value-of select="title" disable-output-escaping="yes" />
          </span>
        </span>
      </div>
    </xsl:for-each>

    <xsl:for-each select="researcher/keywords">
      <div>
        <span>
          <xsl:value-of select="." disable-output-escaping="yes" />
        </span>
      </div>
    </xsl:for-each>

    <xsl:for-each select="researcher/researcher_descriptions/researcher_description/description">
      <div>
        <span>
          <xsl:value-of select="." disable-output-escaping="yes" />
        </span>
      </div>
    </xsl:for-each>
  </xsl:for-each>
</body>
</html>
</xsl:template>
</xsl:stylesheet>
