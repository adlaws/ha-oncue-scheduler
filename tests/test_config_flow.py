"""Tests for the minimal singleton config flow."""

import pytest


@pytest.mark.asyncio
async def test_config_flow_creates_entry():
    from oncue.config_flow import OnCueConfigFlow

    flow = OnCueConfigFlow()
    # First call shows form
    result = await flow.async_step_user(None)
    assert result["type"] == "form"
    assert result["step_id"] == "user"

    # Submit creates entry
    result = await flow.async_step_user({})
    assert result["type"] == "create_entry"
    assert result["title"] == "OnCue"
    assert result["data"] == {}
