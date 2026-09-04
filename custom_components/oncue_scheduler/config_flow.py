"""Config flow for OnCue."""

from __future__ import annotations

from typing import Any

from homeassistant.config_entries import ConfigFlow, ConfigFlowResult

from .const import DOMAIN


class OnCueConfigFlow(ConfigFlow, domain=DOMAIN):
    """Minimal singleton config flow for OnCue."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Handle the user step — show form or create the singleton entry.

        :param user_input: Form data if submitted, or None for initial display.
        :returns: ConfigFlowResult directing to the form or creating the entry.
        """
        await self.async_set_unique_id(DOMAIN)
        self._abort_if_unique_id_configured()

        if user_input is not None:
            return self.async_create_entry(
                title="OnCue",
                data={},
            )

        return self.async_show_form(step_id="user")
