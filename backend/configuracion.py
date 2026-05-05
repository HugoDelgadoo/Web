from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path


class ConfiguracionAplicacion(BaseSettings):
    url_supabase: str = Field(validation_alias="URL_SUPABASE")
    clave_supabase: str = Field(validation_alias="CLAVE_SUPABASE")

    model_config = SettingsConfigDict(
        env_file=Path(__file__).resolve().parent / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


configuracion = ConfiguracionAplicacion()
